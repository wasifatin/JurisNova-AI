from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import EvaluationRun
from app.schemas.schemas import EvaluationResponse
from app.evaluation.benchmark import EvaluationBenchmark

router = APIRouter(prefix="/evaluations", tags=["AI Evaluation & Benchmark Suite"])

@router.get("/metrics", response_model=EvaluationResponse)
def get_latest_evaluation_metrics(db: Session = Depends(get_db)):
    run = db.query(EvaluationRun).order_by(EvaluationRun.created_at.desc()).first()
    if not run:
        # Run live benchmark if none recorded yet
        benchmark_results = EvaluationBenchmark.run_benchmark()
        run = EvaluationRun(
            total_scenarios=benchmark_results["total_scenarios"],
            precision_at_k=benchmark_results["precision_at_k"],
            citation_accuracy=benchmark_results["citation_accuracy"],
            faithfulness_score=benchmark_results["faithfulness_score"],
            gap_detection_f1=benchmark_results["gap_detection_f1"],
            risk_consistency=benchmark_results["risk_consistency"],
            avg_latency_ms=benchmark_results["avg_latency_ms"],
            token_usage_avg=benchmark_results["token_usage_avg"],
            pass_rate=benchmark_results["pass_rate"],
            results_json=benchmark_results["scenario_breakdown"],
            methodology=benchmark_results["methodology"]
        )
        db.add(run)
        db.commit()
        db.refresh(run)
    return run

@router.post("/run-benchmark", response_model=EvaluationResponse)
def trigger_benchmark_execution(db: Session = Depends(get_db)):
    """
    Executes live 40-scenario deterministic evaluation testing:
    - Precision@K
    - Citation Accuracy & Lexical Anchoring
    - Evidence Faithfulness
    - Compliance Gap Detection F1
    - Risk Matrix Consistency (1-5 Scale)
    - Prompt Injection Resistance
    """
    benchmark_results = EvaluationBenchmark.run_benchmark()
    new_run = EvaluationRun(
        total_scenarios=benchmark_results["total_scenarios"],
        precision_at_k=benchmark_results["precision_at_k"],
        citation_accuracy=benchmark_results["citation_accuracy"],
        faithfulness_score=benchmark_results["faithfulness_score"],
        gap_detection_f1=benchmark_results["gap_detection_f1"],
        risk_consistency=benchmark_results["risk_consistency"],
        avg_latency_ms=benchmark_results["avg_latency_ms"],
        token_usage_avg=benchmark_results["token_usage_avg"],
        pass_rate=benchmark_results["pass_rate"],
        results_json=benchmark_results["scenario_breakdown"],
        methodology=benchmark_results["methodology"]
    )
    db.add(new_run)
    db.commit()
    db.refresh(new_run)
    return new_run
