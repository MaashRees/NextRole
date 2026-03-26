"""
Task 3 : Mise à jour MongoDB
- Récupère les données structurées depuis XCom
- Met à jour le document Job dans MongoDB avec les champs extraits
- Passe le statut de 'pending_ocr' --> 'needs_review'
"""

import os
from pymongo import MongoClient
from bson import ObjectId


MONGO_HOST = os.environ.get("DB_HOST", "172.17.0.1")
MONGO_PORT = int(os.environ.get("DB_PORT", "27017"))
MONGO_DB = os.environ.get("DB_NAME", "nextrole")


def run_update_mongodb(**context):
    ti = context["ti"]
    structured = ti.xcom_pull(key="structured", task_ids="clean_format")

    job_id = structured.get("job_id")
    if not job_id:
        raise ValueError("[MONGO] job_id manquant dans les données structurées XCom.")

    # 1. Connexion à MongoDB
    client = MongoClient(host=MONGO_HOST, port=MONGO_PORT)
    db = client[MONGO_DB]
    jobs_collection = db["jobs"]

    # 2. Mise à jour du document avec les champs extraits et passage en 'needs_review'
    update_result = jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {
            "$set": {
                "title": structured.get("title"),
                "company": structured.get("company"),
                "location": structured.get("location"),
                "description": structured.get("description"),
                "parsingStatus": "needs_review",
            }
        },
    )

    if update_result.matched_count == 0:
        raise ValueError(f"[MONGO] Aucun job trouvé avec l'id {job_id}")

    print(f"[MONGO] Job {job_id} mis à jour en statut 'needs_review'.")
    client.close()
