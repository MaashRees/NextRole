"""
Task 2 : Nettoyage et Structuration
- Lit le JSON brut depuis le bucket 'silver'
- Extrait les champs pertinents (titre, entreprise, description complète, salaire, localisation, etc.)
- Sauvegarde un JSON structuré dans le bucket 'gold'
"""

import os
import json
import io
from minio import Minio


MINIO_ENDPOINT = os.environ.get("MINIO_ENDPOINT", "minio")
MINIO_PORT = int(os.environ.get("MINIO_PORT", "9000"))
MINIO_USER = os.environ["MINIO_ROOT_USER"]
MINIO_PASSWORD = os.environ["MINIO_ROOT_PASSWORD"]


def run_clean_format(**context):
    ti = context["ti"]
    silver_key = ti.xcom_pull(key="silver_key", task_ids="azure_ocr")
    job_id = ti.xcom_pull(key="job_id", task_ids="azure_ocr")

    # 1. Lire le résultat brut Azure depuis MinIO 'silver'
    minio_client = Minio(
        f"{MINIO_ENDPOINT}:{MINIO_PORT}",
        access_key=MINIO_USER,
        secret_key=MINIO_PASSWORD,
        secure=False,
    )
    data = minio_client.get_object("silver", silver_key)
    raw_result = json.loads(data.read().decode("utf-8"))

    # 2. Extraire le texte complet du document (description du poste)
    full_text = ""
    for page in raw_result.get("pages", []):
        for line in page.get("lines", []):
            full_text += line.get("content", "") + "\n"

    # 3. Structurer les champs (heuristiques simples - à enrichir selon le format des offres)
    # Ces valeurs seront corrigées par l'utilisateur dans la phase de validation
    lines = [l.strip() for l in full_text.split("\n") if l.strip()]
    structured = {
        "job_id": job_id,
        "title": lines[0] if len(lines) > 0 else "Titre non détecté",
        "company": lines[1] if len(lines) > 1 else "Entreprise non détectée",
        "location": next((l for l in lines if any(k in l.lower() for k in ["paris", "lyon", "france", "remote", "télétravail"])), "Non précisé"),
        "description": full_text,  # Texte intégral de l'offre
        "salary": None,
    }

    # 4. Sauvegarder le JSON structuré dans MinIO 'gold'
    gold_key = silver_key.replace("silver_", "gold_").replace(".json", ".json")
    structured_bytes = json.dumps(structured, ensure_ascii=False).encode("utf-8")
    minio_client.put_object(
        "gold",
        gold_key,
        io.BytesIO(structured_bytes),
        length=len(structured_bytes),
        content_type="application/json",
    )

    # Passer les données au contexte XCom pour la tâche suivante
    ti.xcom_push(key="gold_key", value=gold_key)
    ti.xcom_push(key="structured", value=structured)
    print(f"[CLEAN] Données structurées sauvegardées dans gold/{gold_key}")
