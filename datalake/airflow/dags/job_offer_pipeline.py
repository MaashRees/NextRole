from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator

from tasks.task_azure_ocr import run_azure_ocr
from tasks.task_clean_format import run_clean_format
from tasks.task_update_mongodb import run_update_mongodb

with DAG(
    dag_id="job_offer_pipeline",
    description="Pipeline d'extraction OCR pour les offres d'emploi NextRole",
    start_date=datetime(2026, 1, 1),
    schedule=None,
    catchup=False,
    tags=["nextrole", "ocr", "jobs"],
) as dag:

    t_ocr = PythonOperator(
        task_id="azure_ocr",
        python_callable=run_azure_ocr,
    )

    t_clean = PythonOperator(
        task_id="clean_format",
        python_callable=run_clean_format,
    )

    t_mongo = PythonOperator(
        task_id="update_mongodb",
        python_callable=run_update_mongodb,
    )

    t_ocr >> t_clean >> t_mongo
