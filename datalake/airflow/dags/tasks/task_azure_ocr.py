"""
Task 1 : Azure OCR
- Lit le fichier PDF depuis le bucket MinIO 'bronze'
- Envoie le fichier à Azure Document Intelligence (Prebuilt General Document)
- Sauvegarde le résultat brut JSON dans le bucket MinIO 'silver'
"""

import os
import json
import io
from minio import Minio
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.core.credentials import AzureKeyCredential


AZURE_ENDPOINT = os.environ["AZURE_OCR_ENDPOINT"]
AZURE_KEY = os.environ["AZURE_OCR_KEY"]
MINIO_ENDPOINT = os.environ.get("MINIO_ENDPOINT", "minio")
MINIO_PORT = int(os.environ.get("MINIO_PORT", "9000"))
MINIO_USER = os.environ["MINIO_ROOT_USER"]
MINIO_PASSWORD = os.environ["MINIO_ROOT_PASSWORD"]


def run_azure_ocr(**context):
    conf = context["dag_run"].conf
    doc_name = conf["doc_name"]
    job_id = conf["job_id"]

    # 1. Lire le fichier depuis MinIO 'bronze'
    minio_client = Minio(
        f"{MINIO_ENDPOINT}:{MINIO_PORT}",
        access_key=MINIO_USER,
        secret_key=MINIO_PASSWORD,
        secure=False,
    )
    data = minio_client.get_object("bronze", doc_name)
    file_bytes = data.read()

    # 2. Envoyer à Azure Document Intelligence
    ai_client = DocumentIntelligenceClient(
        endpoint=AZURE_ENDPOINT,
        credential=AzureKeyCredential(AZURE_KEY),
    )
    poller = ai_client.begin_analyze_document(
        "prebuilt-layout",
        analyze_request=io.BytesIO(file_bytes),
        content_type="application/octet-stream",
    )
    result = poller.result()

    # 3. Sauvegarder le résultat brut dans MinIO 'silver'
    base_name = doc_name.rsplit(".", 1)[0]
    silver_key = f"silver_{base_name}.json"
    result_json = result.as_dict()
    result_bytes = json.dumps(result_json).encode("utf-8")
    minio_client.put_object(
        "silver",
        silver_key,
        io.BytesIO(result_bytes),
        length=len(result_bytes),
        content_type="application/json",
    )

    # Passer les données au contexte XCom pour la tâche suivante
    context["ti"].xcom_push(key="silver_key", value=silver_key)
    context["ti"].xcom_push(key="job_id", value=job_id)
    print(f"[OCR] Résultat Azure sauvegardé dans silver/{silver_key}")
