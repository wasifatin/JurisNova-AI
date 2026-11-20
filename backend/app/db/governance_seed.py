import hashlib
import random
from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal, engine, Base
from app.models.all_models import Organization, User, OrganizationMember
from app.models.governance_models import (
    ServiceArea,
    PublicDepartment,
    CitizenComplaint,
    PublicProject,
    ProjectMilestone,
    PublicProcurement,
    MonthlyServicePerformance,
    BudgetAllocation,
    GovernanceSignal,
    GovernanceInvestigation,
    GovernanceAuditLog,
)

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

def compute_sha256(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()

def seed_governance_data():
    print("[+] Initializing Public Sector Governance Tables & Dataset...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if already seeded
        existing_ward = db.query(ServiceArea).filter(ServiceArea.ward_number == 12).first()
        if existing_ward:
            print("[*] Public Sector Governance dataset already initialized. Skipping.")
            return

        # 1. Organization: Dhaka City Services Authority
        org = db.query(Organization).filter(Organization.slug == "dhaka-city-services").first()
        if not org:
            org = Organization(
                id="org-dhaka-gov-01",
                name="Dhaka City Services Authority",
                slug="dhaka-city-services",
                domain="dcsa.gov.bd",
                jurisdiction="Dhaka, Bangladesh",
                industry="Public Sector Governance & Municipal Services"
            )
            db.add(org)
            db.flush()

        # Link existing users to this demo org as well so any user can inspect
        users = db.query(User).all()
        for u in users:
            existing_mem = db.query(OrganizationMember).filter(
                OrganizationMember.user_id == u.id,
                OrganizationMember.organization_id == org.id
            ).first()
            if not existing_mem:
                db.add(OrganizationMember(
                    user_id=u.id,
                    organization_id=org.id,
                    role=u.system_role or "Viewer"
                ))
        db.flush()

        # -------------------------------------------------------------
        # 2. Seed 12 Service Areas (Wards 1 through 12)
        # -------------------------------------------------------------
        print("[+] Seeding 12 Dhaka Service Areas (Wards 1-12)...")
        # Ward coordinates and stylized SVG paths for visualization
        ward_specs = [
            {"num": 1, "name": "Ward 1 - Uttara North", "zone": "Zone 1 (North)", "pop": 138000, "health": 78, "delta_p": -1.2, "delta_c": 3.0, "anomaly": False, "delayed": 1, "signals": 1},
            {"num": 2, "name": "Ward 2 - Mirpur East", "zone": "Zone 2 (North-West)", "pop": 162000, "health": 69, "delta_p": -13.5, "delta_c": 29.0, "anomaly": True, "delayed": 2, "signals": 2},
            {"num": 3, "name": "Ward 3 - Gulshan & Banani", "zone": "Zone 3 (Central North)", "pop": 120000, "health": 82, "delta_p": 1.0, "delta_c": -2.0, "anomaly": False, "delayed": 0, "signals": 0},
            {"num": 4, "name": "Ward 4 - Dhanmondi", "zone": "Zone 4 (Central West)", "pop": 140000, "health": 80, "delta_p": 0.5, "delta_c": 1.0, "anomaly": False, "delayed": 0, "signals": 1},
            {"num": 5, "name": "Ward 5 - Mohammadpur West", "zone": "Zone 5 (West)", "pop": 155000, "health": 68, "delta_p": -14.0, "delta_c": 30.0, "anomaly": True, "delayed": 2, "signals": 2},
            {"num": 6, "name": "Ward 6 - Tejgaon Industrial", "zone": "Zone 6 (Central)", "pop": 115000, "health": 76, "delta_p": -2.0, "delta_c": 4.0, "anomaly": False, "delayed": 1, "signals": 1},
            {"num": 7, "name": "Ward 7 - Motijheel & Dilkusha", "zone": "Zone 7 (Financial District)", "pop": 110000, "health": 79, "delta_p": 0.0, "delta_c": 2.0, "anomaly": False, "delayed": 1, "signals": 0},
            {"num": 8, "name": "Ward 8 - Khilgaon & Basabo", "zone": "Zone 8 (East)", "pop": 148000, "health": 68, "delta_p": -13.8, "delta_c": 32.0, "anomaly": True, "delayed": 2, "signals": 2},
            {"num": 9, "name": "Ward 9 - Old Dhaka Kotwali", "zone": "Zone 9 (South Heritage)", "pop": 165000, "health": 72, "delta_p": -3.5, "delta_c": 6.0, "anomaly": False, "delayed": 1, "signals": 1},
            {"num": 10, "name": "Ward 10 - Lalbagh & Hazaribagh", "zone": "Zone 10 (South-West)", "pop": 150000, "health": 73, "delta_p": -2.8, "delta_c": 5.0, "anomaly": False, "delayed": 1, "signals": 1},
            {"num": 11, "name": "Ward 11 - Badda & Rampura", "zone": "Zone 11 (North-East)", "pop": 142000, "health": 75, "delta_p": -1.5, "delta_c": 3.0, "anomaly": False, "delayed": 1, "signals": 1},
            # HERO WARD 12: Health: 67, Complaints: +28%, Performance: -11%, Delayed Projects: 2, Active Signals: 3
            {"num": 12, "name": "Ward 12 - Mirpur South & Kafrul", "zone": "Zone 12 (North-West Central)", "pop": 158000, "health": 67, "delta_p": -11.0, "delta_c": 28.0, "anomaly": True, "delayed": 2, "signals": 3},
        ]

        ward_map = {}
        for w in ward_specs:
            sa = ServiceArea(
                id=f"ward-{w['num']:02d}",
                ward_number=w["num"],
                name=w["name"],
                geographic_zone=w["zone"],
                population=w["pop"],
                health_score=w["health"],
                service_performance_delta=w["delta_p"],
                complaint_growth_delta=w["delta_c"],
                delayed_projects_count=w["delayed"],
                active_signals_count=w["signals"],
                is_anomaly_ward=w["anomaly"],
                metadata_json={
                    "district": "Dhaka",
                    "division": "Dhaka",
                    "grid_coords": {"x": ((w["num"] - 1) % 4) * 120 + 60, "y": ((w["num"] - 1) // 4) * 110 + 60}
                }
            )
            db.add(sa)
            ward_map[w["num"]] = sa
        db.flush()

        # -------------------------------------------------------------
        # 3. Seed 10 Operational Public Departments
        # -------------------------------------------------------------
        print("[+] Seeding 10 Public Departments...")
        dept_specs = [
            ("dept-waste", "Waste Management Department", "WMD", "Engr. Rafiqul Islam", 68.0, 52.4, 3, 620),
            ("dept-roads", "Roads and Transport Department", "RTD", "Engr. Shamsul Haque", 55.0, 41.2, 3, 380),
            ("dept-water", "Water Supply Department", "WSD", "Engr. Nurun Nahar", 42.0, 31.8, 2, 290),
            ("dept-drainage", "Drainage and Sewerage Department", "DSD", "Engr. Kamal Uddin", 38.0, 26.5, 2, 50),
            ("dept-lighting", "Street Lighting and Electrical Department", "SLED", "Engr. Tariq Hasan", 18.0, 14.1, 2, 140),
            ("dept-public-works", "Public Works Department", "PWD", "Engr. Mahbub Alam", 45.0, 34.0, 2, 20),
            ("dept-procurement", "Procurement and Contract Management Department", "PCMD", "Zahidul Karim, Director", 22.0, 16.8, 2, 0),
            ("dept-finance", "Finance and Budget Department", "FBD", "Sharmin Sultana, CFO", 12.0, 9.4, 1, 0),
            ("dept-citizen-services", "Citizen Services Department", "CSD", "Nasima Akhter, Director", 15.0, 11.2, 1, 0),
            ("dept-it-data", "Information Technology and Data Governance Department", "ITDGD", "Tanvir Ahmed, CIO", 20.0, 15.6, 2, 0),
        ]

        dept_map = {}
        for d_id, name, code, lead, alloc, spent, prj_c, cmp_c in dept_specs:
            pd = PublicDepartment(
                id=d_id,
                name=name,
                code=code,
                lead_officer=lead,
                allocated_budget_cr=alloc,
                spent_budget_cr=spent,
                active_projects_count=prj_c,
                open_complaints_count=cmp_c
            )
            db.add(pd)
            dept_map[d_id] = pd
        db.flush()

        # -------------------------------------------------------------
        # 4. Seed EXACTLY 1,500 Synthetic Complaints
        # Distribution: Waste: 620, Road: 380, Water: 290, Lighting: 140, Other: 70
        # -------------------------------------------------------------
        print("[+] Generating exactly 1,500 Synthetic Citizen Complaints...")
        # Reproducible random seed
        rng = random.Random(20261120)

        # Base reference date: November 20, 2026
        now_dt = datetime(2026, 11, 20, 12, 0, 0, tzinfo=timezone.utc)

        # Anomaly wards: 2, 5, 8, 12
        anomaly_ward_nums = [2, 5, 8, 12]
        normal_ward_nums = [1, 3, 4, 6, 7, 9, 10, 11]

        complaints_list = []

        # A. Waste Collection: 620
        # 78% of the relevant waste collection cluster is concentrated in Wards 2, 5, 8, 12 -> 484 complaints
        # 22% -> 136 complaints in other wards
        waste_cluster_count = 484
        waste_normal_count = 136

        waste_descriptions_cluster = [
            "Overflowing secondary waste transfer container on secondary arterial road, persistent 48h uncollected accumulation.",
            "Compactor truck collection skipped scheduled morning window for third consecutive day.",
            "Accumulated municipal solid waste obstructing roadside pedestrian walkway and storm drain grating.",
            "Debris pile-up near primary school gate causing health hazard and transit bottleneck.",
            "Open container spillage along main market corridor awaiting mechanical loader deployment.",
            "Residential door-to-door waste collection service interrupted due to delayed regional routing van.",
        ]
        waste_descriptions_normal = [
            "Delayed collection container pickup reported at neighborhood intersection.",
            "Litter bin overflowing near public bus terminal.",
            "Waste disposal schedule notification requested by local community association.",
            "Organic waste container requires sanitation wash and lid hinge repair.",
        ]

        # 484 Cluster Waste Complaints
        for i in range(waste_cluster_count):
            w_num = rng.choice(anomaly_ward_nums)
            days_ago = rng.randint(1, 75)  # Heavy concentration in last 2-3 months
            sub_dt = now_dt - timedelta(days=days_ago, hours=rng.randint(1, 23))
            
            # Anomaly resolution time increased by 18% -> avg 4.2 days vs 3.2 days
            is_resolved = rng.random() < 0.65  # lower resolution rate
            res_days = rng.randint(4, 9) if is_resolved else None
            res_dt = sub_dt + timedelta(days=res_days) if res_days else None

            complaints_list.append(CitizenComplaint(
                id=f"cmp-waste-{i+1:04d}",
                organization_id=org.id,
                complaint_ref=f"CMP-2026-{len(complaints_list)+1:04d}",
                ward_id=ward_map[w_num].id,
                department_id="dept-waste",
                service_category="Waste Collection",
                service_id="SRV-WASTE-01",
                submission_date=sub_dt,
                resolution_date=res_dt,
                resolution_duration_days=res_days,
                priority="Critical" if rng.random() < 0.45 else "High",
                status="Resolved" if is_resolved else ("In Progress" if rng.random() < 0.7 else "Open"),
                description=rng.choice(waste_descriptions_cluster),
                source_reference=f"CIT-MOBILE-W{w_num}-{rng.randint(1000, 9999)}",
                sentiment="Frustrated",
                evidence_reference="EVD-DCSA-2026-WST-CLUSTER",
                is_anomaly_cluster=True
            ))

        # 136 Normal Waste Complaints
        for i in range(waste_normal_count):
            w_num = rng.choice(normal_ward_nums)
            days_ago = rng.randint(1, 150)
            sub_dt = now_dt - timedelta(days=days_ago, hours=rng.randint(1, 23))
            is_resolved = rng.random() < 0.82
            res_days = rng.randint(2, 5) if is_resolved else None
            res_dt = sub_dt + timedelta(days=res_days) if res_days else None

            complaints_list.append(CitizenComplaint(
                id=f"cmp-waste-norm-{i+1:04d}",
                organization_id=org.id,
                complaint_ref=f"CMP-2026-{len(complaints_list)+1:04d}",
                ward_id=ward_map[w_num].id,
                department_id="dept-waste",
                service_category="Waste Collection",
                service_id="SRV-WASTE-01",
                submission_date=sub_dt,
                resolution_date=res_dt,
                resolution_duration_days=res_days,
                priority="Medium" if rng.random() < 0.6 else "Low",
                status="Resolved" if is_resolved else "Open",
                description=rng.choice(waste_descriptions_normal),
                source_reference=f"CIT-WEB-W{w_num}-{rng.randint(1000, 9999)}",
                sentiment="Neutral",
                evidence_reference="EVD-DCSA-2026-WST-BASELINE",
                is_anomaly_cluster=False
            ))

        # B. Road Condition: 380 (mapped to Road Maintenance)
        road_descriptions = [
            "Severe pothole cluster damaging vehicular suspension on secondary avenue.",
            "Asphalt subsidence following utility line trench excavation.",
            "Waterlogged bitumen surface cracking near intersection.",
            "Speed bump markings eroded and requiring reflective repainting.",
            "Unpaved shoulder causing dust hazard and vehicular slowing.",
        ]
        for i in range(380):
            w_num = rng.choice(list(range(1, 13)))
            days_ago = rng.randint(1, 150)
            sub_dt = now_dt - timedelta(days=days_ago, hours=rng.randint(1, 23))
            is_resolved = rng.random() < 0.74
            res_days = rng.randint(3, 7) if is_resolved else None
            res_dt = sub_dt + timedelta(days=res_days) if res_days else None

            complaints_list.append(CitizenComplaint(
                id=f"cmp-road-{i+1:04d}",
                organization_id=org.id,
                complaint_ref=f"CMP-2026-{len(complaints_list)+1:04d}",
                ward_id=ward_map[w_num].id,
                department_id="dept-roads",
                service_category="Road Condition",
                service_id="SRV-ROAD-01",
                submission_date=sub_dt,
                resolution_date=res_dt,
                resolution_duration_days=res_days,
                priority="High" if rng.random() < 0.4 else "Medium",
                status="Resolved" if is_resolved else "In Progress",
                description=rng.choice(road_descriptions),
                source_reference=f"CIT-HOTLINE-W{w_num}-{rng.randint(1000, 9999)}",
                sentiment="Frustrated" if rng.random() < 0.5 else "Neutral",
                evidence_reference="EVD-DCSA-2026-ROAD-MAINT",
                is_anomaly_cluster=False
            ))

        # C. Water Service: 290
        water_descriptions = [
            "Low municipal line pressure during peak morning household hours.",
            "Turbid water supply requiring distribution pipe flushing.",
            "Supply pipeline leakage near residential boundary line.",
            "Intermittent supply interruption without scheduled advance notification.",
        ]
        for i in range(290):
            w_num = rng.choice(list(range(1, 13)))
            days_ago = rng.randint(1, 150)
            sub_dt = now_dt - timedelta(days=days_ago, hours=rng.randint(1, 23))
            is_resolved = rng.random() < 0.78
            res_days = rng.randint(2, 5) if is_resolved else None
            res_dt = sub_dt + timedelta(days=res_days) if res_days else None

            complaints_list.append(CitizenComplaint(
                id=f"cmp-water-{i+1:04d}",
                organization_id=org.id,
                complaint_ref=f"CMP-2026-{len(complaints_list)+1:04d}",
                ward_id=ward_map[w_num].id,
                department_id="dept-water",
                service_category="Water Service",
                service_id="SRV-WATER-01",
                submission_date=sub_dt,
                resolution_date=res_dt,
                resolution_duration_days=res_days,
                priority="Medium",
                status="Resolved" if is_resolved else "In Progress",
                description=rng.choice(water_descriptions),
                source_reference=f"CIT-WEB-W{w_num}-{rng.randint(1000, 9999)}",
                sentiment="Neutral",
                evidence_reference="EVD-DCSA-2026-WATER-DIST",
                is_anomaly_cluster=False
            ))

        # D. Street Lighting: 140
        light_descriptions = [
            "Street light pole lamp fixture unlit for multiple nights.",
            "Flickering LED luminaire causing reduced visibility at pedestrian crossing.",
            "Cable connection fault tripping circuit breaker after rainfall.",
        ]
        for i in range(140):
            w_num = rng.choice(list(range(1, 13)))
            days_ago = rng.randint(1, 150)
            sub_dt = now_dt - timedelta(days=days_ago, hours=rng.randint(1, 23))
            is_resolved = rng.random() < 0.85
            res_days = rng.randint(1, 4) if is_resolved else None
            res_dt = sub_dt + timedelta(days=res_days) if res_days else None

            complaints_list.append(CitizenComplaint(
                id=f"cmp-light-{i+1:04d}",
                organization_id=org.id,
                complaint_ref=f"CMP-2026-{len(complaints_list)+1:04d}",
                ward_id=ward_map[w_num].id,
                department_id="dept-lighting",
                service_category="Street Lighting",
                service_id="SRV-LIGHT-01",
                submission_date=sub_dt,
                resolution_date=res_dt,
                resolution_duration_days=res_days,
                priority="Low" if rng.random() < 0.7 else "Medium",
                status="Resolved" if is_resolved else "Open",
                description=rng.choice(light_descriptions),
                source_reference=f"CIT-PORTAL-W{w_num}-{rng.randint(1000, 9999)}",
                sentiment="Neutral",
                evidence_reference="EVD-DCSA-2026-ELEC-LIGHT",
                is_anomaly_cluster=False
            ))

        # E. Other (Drainage + uncategorized): 70
        other_descriptions = [
            "Stormwater drainage conduit clogged with sediment and plastic siltation.",
            "Broken manhole concrete cover posing pedestrian risk near market.",
            "Stagnant water ponding in alleyway following monsoon rainfall.",
            "Municipal park maintenance and perimeter fence repair request.",
        ]
        for i in range(70):
            w_num = rng.choice(list(range(1, 13)))
            days_ago = rng.randint(1, 150)
            sub_dt = now_dt - timedelta(days=days_ago, hours=rng.randint(1, 23))
            is_resolved = rng.random() < 0.72
            res_days = rng.randint(3, 6) if is_resolved else None
            res_dt = sub_dt + timedelta(days=res_days) if res_days else None

            complaints_list.append(CitizenComplaint(
                id=f"cmp-other-{i+1:04d}",
                organization_id=org.id,
                complaint_ref=f"CMP-2026-{len(complaints_list)+1:04d}",
                ward_id=ward_map[w_num].id,
                department_id="dept-drainage",
                service_category="Other",
                service_id="SRV-OTHER-01",
                submission_date=sub_dt,
                resolution_date=res_dt,
                resolution_duration_days=res_days,
                priority="Medium",
                status="Resolved" if is_resolved else "In Progress",
                description=rng.choice(other_descriptions),
                source_reference=f"CIT-APP-W{w_num}-{rng.randint(1000, 9999)}",
                sentiment="Frustrated" if rng.random() < 0.5 else "Neutral",
                evidence_reference="EVD-DCSA-2026-MUNICIPAL-OTHER",
                is_anomaly_cluster=False
            ))

        assert len(complaints_list) == 1500, f"Expected 1,500 complaints, got {len(complaints_list)}"
        print(f"[+] Total complaints generated: {len(complaints_list)}")
        db.bulk_save_objects(complaints_list)
        db.flush()

        # -------------------------------------------------------------
        # 5. Seed EXACTLY 20 Public Projects
        # -------------------------------------------------------------
        print("[+] Seeding exactly 20 Public Projects...")
        projects_specs = [
            # 1. HERO PROJECT: Waste Management Service Improvement
            {
                "id": "prj-001", "code": "PRJ-2026-001",
                "name": "Waste Management Service Improvement",
                "dept": "dept-waste", "category": "Waste Collection",
                "wards": ["Ward 2", "Ward 5", "Ward 8", "Ward 12"],
                "approved_cr": 50.0, "alloc_cr": 50.0, "rel_cr": 38.0, "spent_cr": 32.5,
                "planned_prog": 80.0, "actual_prog": 54.0, "fin_prog": 65.0,
                "start": datetime(2025, 4, 1, tzinfo=timezone.utc),
                "end": datetime(2026, 12, 31, tzinfo=timezone.utc),
                "status": "Delayed",
                "variance_label": "Progress variance — Requires review",
                "evidence": ["EVD-PRJ-2026-001-Q3-LOG", "EVD-PROC-2026-041-DELIVERY"]
            },
            # 2. Road Rehabilitation Program
            {
                "id": "prj-002", "code": "PRJ-2026-002",
                "name": "Road Rehabilitation Program",
                "dept": "dept-roads", "category": "Road Maintenance",
                "wards": ["Ward 1", "Ward 3", "Ward 6"],
                "approved_cr": 42.0, "alloc_cr": 42.0, "rel_cr": 30.0, "spent_cr": 28.5,
                "planned_prog": 70.0, "actual_prog": 66.0, "fin_prog": 68.0,
                "start": datetime(2025, 6, 1, tzinfo=timezone.utc),
                "end": datetime(2027, 2, 28, tzinfo=timezone.utc),
                "status": "On Schedule",
                "variance_label": "Normal Execution Variance",
                "evidence": ["EVD-PRJ-2026-002-SURFACE"]
            },
            # 3. Drainage Improvement Project
            {
                "id": "prj-003", "code": "PRJ-2026-003",
                "name": "Drainage Improvement Project",
                "dept": "dept-drainage", "category": "Drainage",
                "wards": ["Ward 8", "Ward 9", "Ward 10"],
                "approved_cr": 35.0, "alloc_cr": 35.0, "rel_cr": 22.0, "spent_cr": 19.8,
                "planned_prog": 60.0, "actual_prog": 52.0, "fin_prog": 56.5,
                "start": datetime(2025, 8, 1, tzinfo=timezone.utc),
                "end": datetime(2027, 4, 30, tzinfo=timezone.utc),
                "status": "In Progress",
                "variance_label": "Moderate Progress Variance",
                "evidence": ["EVD-PRJ-2026-003-DRAIN"]
            },
            # 4. Street Lighting Upgrade
            {
                "id": "prj-004", "code": "PRJ-2026-004",
                "name": "Street Lighting Upgrade",
                "dept": "dept-lighting", "category": "Street Lighting",
                "wards": ["Ward 4", "Ward 7", "Ward 11"],
                "approved_cr": 15.0, "alloc_cr": 15.0, "rel_cr": 13.5, "spent_cr": 12.8,
                "planned_prog": 85.0, "actual_prog": 82.0, "fin_prog": 85.3,
                "start": datetime(2025, 3, 1, tzinfo=timezone.utc),
                "end": datetime(2026, 11, 30, tzinfo=timezone.utc),
                "status": "On Schedule",
                "variance_label": "Normal Execution Variance",
                "evidence": ["EVD-PRJ-2026-004-LED"]
            },
            # 5. BUDGET HERO CASE: Financial progress 75% vs Physical progress 39%
            {
                "id": "prj-005", "code": "PRJ-2026-005",
                "name": "Secondary Transfer Station Modernization",
                "dept": "dept-public-works", "category": "Waste Collection",
                "wards": ["Ward 2", "Ward 12"],
                "approved_cr": 28.0, "alloc_cr": 28.0, "rel_cr": 21.0, "spent_cr": 21.0,
                "planned_prog": 70.0, "actual_prog": 39.0, "fin_prog": 75.0,
                "start": datetime(2025, 5, 15, tzinfo=timezone.utc),
                "end": datetime(2027, 1, 15, tzinfo=timezone.utc),
                "status": "Requires Review",
                "variance_label": "Financial-to-physical progress variance — Needs Review",
                "evidence": ["EVD-PRJ-2026-005-AUDIT-DISBURSAL", "EVD-PRJ-2026-005-PHYSICAL-PROGRESS"]
            },
            # Projects 6 to 20
            {"id": "prj-006", "code": "PRJ-2026-006", "name": "Deep Tube Well & Water Treatment Facility", "dept": "dept-water", "category": "Water Service", "wards": ["Ward 1", "Ward 2"], "approved_cr": 24.0, "alloc_cr": 24.0, "rel_cr": 18.0, "spent_cr": 16.5, "planned_prog": 65.0, "actual_prog": 63.0, "fin_prog": 68.7, "start": datetime(2025, 7, 1, tzinfo=timezone.utc), "end": datetime(2027, 3, 31, tzinfo=timezone.utc), "status": "On Schedule", "variance_label": "Normal", "evidence": []},
            {"id": "prj-007", "code": "PRJ-2026-007", "name": "Automated Traffic Signaling & Surveillance", "dept": "dept-it-data", "category": "Road Maintenance", "wards": ["Ward 3", "Ward 7"], "approved_cr": 16.0, "alloc_cr": 16.0, "rel_cr": 12.0, "spent_cr": 11.2, "planned_prog": 75.0, "actual_prog": 71.0, "fin_prog": 70.0, "start": datetime(2025, 2, 1, tzinfo=timezone.utc), "end": datetime(2026, 12, 15, tzinfo=timezone.utc), "status": "On Schedule", "variance_label": "Normal", "evidence": []},
            {"id": "prj-008", "code": "PRJ-2026-008", "name": "Khilgaon Stormwater Canal Excavation", "dept": "dept-drainage", "category": "Drainage", "wards": ["Ward 8"], "approved_cr": 19.5, "alloc_cr": 19.5, "rel_cr": 14.0, "spent_cr": 13.8, "planned_prog": 60.0, "actual_prog": 48.0, "fin_prog": 70.7, "start": datetime(2025, 9, 1, tzinfo=timezone.utc), "end": datetime(2027, 5, 31, tzinfo=timezone.utc), "status": "Delayed", "variance_label": "Moderate Progress Variance", "evidence": []},
            {"id": "prj-009", "code": "PRJ-2026-009", "name": "Integrated Citizen Digital Portal & Mobile App", "dept": "dept-citizen-services", "category": "Other", "wards": ["Ward 1", "Ward 2", "Ward 3", "Ward 4"], "approved_cr": 8.5, "alloc_cr": 8.5, "rel_cr": 7.0, "spent_cr": 6.8, "planned_prog": 90.0, "actual_prog": 88.0, "fin_prog": 80.0, "start": datetime(2025, 1, 15, tzinfo=timezone.utc), "end": datetime(2026, 10, 31, tzinfo=timezone.utc), "status": "Completed", "variance_label": "Completed on Schedule", "evidence": []},
            {"id": "prj-010", "code": "PRJ-2026-010", "name": "Mohammadpur Ward 5 Footpath Rehabilitation", "dept": "dept-roads", "category": "Road Maintenance", "wards": ["Ward 5"], "approved_cr": 11.0, "alloc_cr": 11.0, "rel_cr": 8.0, "spent_cr": 7.6, "planned_prog": 60.0, "actual_prog": 50.0, "fin_prog": 69.1, "start": datetime(2025, 10, 1, tzinfo=timezone.utc), "end": datetime(2027, 2, 28, tzinfo=timezone.utc), "status": "Delayed", "variance_label": "Minor Delay", "evidence": []},
            {"id": "prj-011", "code": "PRJ-2026-011", "name": "Old Dhaka Heritage Zone Sewerage Renewal", "dept": "dept-drainage", "category": "Drainage", "wards": ["Ward 9", "Ward 10"], "approved_cr": 26.0, "alloc_cr": 26.0, "rel_cr": 18.0, "spent_cr": 16.5, "planned_prog": 55.0, "actual_prog": 51.0, "fin_prog": 63.4, "start": datetime(2025, 6, 15, tzinfo=timezone.utc), "end": datetime(2027, 8, 31, tzinfo=timezone.utc), "status": "In Progress", "variance_label": "Normal", "evidence": []},
            {"id": "prj-012", "code": "PRJ-2026-012", "name": "Smart Water Metering Network Deployment", "dept": "dept-water", "category": "Water Service", "wards": ["Ward 3", "Ward 4"], "approved_cr": 14.5, "alloc_cr": 14.5, "rel_cr": 11.0, "spent_cr": 10.2, "planned_prog": 80.0, "actual_prog": 78.0, "fin_prog": 70.3, "start": datetime(2025, 4, 1, tzinfo=timezone.utc), "end": datetime(2026, 12, 31, tzinfo=timezone.utc), "status": "On Schedule", "variance_label": "Normal", "evidence": []},
            {"id": "prj-013", "code": "PRJ-2026-013", "name": "Badda High-Mast Electrical Tower Installation", "dept": "dept-lighting", "category": "Street Lighting", "wards": ["Ward 11"], "approved_cr": 6.5, "alloc_cr": 6.5, "rel_cr": 5.5, "spent_cr": 5.2, "planned_prog": 90.0, "actual_prog": 89.0, "fin_prog": 80.0, "start": datetime(2025, 3, 1, tzinfo=timezone.utc), "end": datetime(2026, 11, 15, tzinfo=timezone.utc), "status": "Completed", "variance_label": "Completed", "evidence": []},
            {"id": "prj-014", "code": "PRJ-2026-014", "name": "Mirpur Sector 12 Municipal Community Center", "dept": "dept-public-works", "category": "Other", "wards": ["Ward 12"], "approved_cr": 17.0, "alloc_cr": 17.0, "rel_cr": 12.0, "spent_cr": 11.5, "planned_prog": 65.0, "actual_prog": 45.0, "fin_prog": 67.6, "start": datetime(2025, 8, 1, tzinfo=timezone.utc), "end": datetime(2027, 6, 30, tzinfo=timezone.utc), "status": "Delayed", "variance_label": "Structural Review Pending", "evidence": []},
            {"id": "prj-015", "code": "PRJ-2026-015", "name": "Municipal Cloud Infrastructure & Disaster Recovery", "dept": "dept-it-data", "category": "Other", "wards": ["Ward 1", "Ward 7"], "approved_cr": 12.0, "alloc_cr": 12.0, "rel_cr": 10.0, "spent_cr": 9.6, "planned_prog": 85.0, "actual_prog": 84.0, "fin_prog": 80.0, "start": datetime(2025, 2, 1, tzinfo=timezone.utc), "end": datetime(2026, 10, 31, tzinfo=timezone.utc), "status": "Completed", "variance_label": "Completed", "evidence": []},
            {"id": "prj-016", "code": "PRJ-2026-016", "name": "Bio-Medical Waste Segregation Facility", "dept": "dept-waste", "category": "Waste Collection", "wards": ["Ward 6", "Ward 9"], "approved_cr": 18.0, "alloc_cr": 18.0, "rel_cr": 12.0, "spent_cr": 10.5, "planned_prog": 50.0, "actual_prog": 46.0, "fin_prog": 58.3, "start": datetime(2025, 11, 1, tzinfo=timezone.utc), "end": datetime(2027, 9, 30, tzinfo=timezone.utc), "status": "In Progress", "variance_label": "Normal", "evidence": []},
            {"id": "prj-017", "code": "PRJ-2026-017", "name": "Dhanmondi Lake Perimeter Walkway Illumination", "dept": "dept-lighting", "category": "Street Lighting", "wards": ["Ward 4"], "approved_cr": 4.8, "alloc_cr": 4.8, "rel_cr": 4.2, "spent_cr": 4.1, "planned_prog": 95.0, "actual_prog": 94.0, "fin_prog": 85.4, "start": datetime(2025, 1, 1, tzinfo=timezone.utc), "end": datetime(2026, 9, 30, tzinfo=timezone.utc), "status": "Completed", "variance_label": "Completed", "evidence": []},
            {"id": "prj-018", "code": "PRJ-2026-018", "name": "Uttara Sector 7 Storm Drainage Pumping Unit", "dept": "dept-drainage", "category": "Drainage", "wards": ["Ward 1"], "approved_cr": 13.5, "alloc_cr": 13.5, "rel_cr": 9.0, "spent_cr": 8.4, "planned_prog": 70.0, "actual_prog": 67.0, "fin_prog": 62.2, "start": datetime(2025, 5, 1, tzinfo=timezone.utc), "end": datetime(2027, 1, 31, tzinfo=timezone.utc), "status": "On Schedule", "variance_label": "Normal", "evidence": []},
            {"id": "prj-019", "code": "PRJ-2026-019", "name": "Central Asphalt Mixing Plant Modernization", "dept": "dept-roads", "category": "Road Maintenance", "wards": ["Ward 6"], "approved_cr": 21.0, "alloc_cr": 21.0, "rel_cr": 15.0, "spent_cr": 14.1, "planned_prog": 55.0, "actual_prog": 52.0, "fin_prog": 67.1, "start": datetime(2025, 7, 1, tzinfo=timezone.utc), "end": datetime(2027, 7, 31, tzinfo=timezone.utc), "status": "In Progress", "variance_label": "Normal", "evidence": []},
            {"id": "prj-020", "code": "PRJ-2026-020", "name": "Automated e-Tendering & Contract Integrity System", "dept": "dept-procurement", "category": "Other", "wards": ["Ward 7"], "approved_cr": 7.5, "alloc_cr": 7.5, "rel_cr": 6.5, "spent_cr": 6.2, "planned_prog": 90.0, "actual_prog": 88.0, "fin_prog": 82.6, "start": datetime(2025, 2, 15, tzinfo=timezone.utc), "end": datetime(2026, 11, 30, tzinfo=timezone.utc), "status": "On Schedule", "variance_label": "Normal", "evidence": []},
        ]

        project_map = {}
        for p in projects_specs:
            prj = PublicProject(
                id=p["id"],
                project_code=p["code"],
                project_name=p["name"],
                department_id=p["dept"],
                service_category=p["category"],
                ward_associations=p["wards"],
                approved_budget_cr=p["approved_cr"],
                allocated_budget_cr=p["alloc_cr"],
                released_amount_cr=p["rel_cr"],
                spent_amount_cr=p["spent_cr"],
                planned_physical_progress=p["planned_prog"],
                actual_physical_progress=p["actual_prog"],
                financial_progress=p["fin_prog"],
                start_date=p["start"],
                planned_completion_date=p["end"],
                status=p["status"],
                variance_label=p["variance_label"],
                evidence_references=p["evidence"]
            )
            db.add(prj)
            project_map[p["code"]] = prj
        db.flush()

        # Seed Milestones for Hero Project PRJ-2026-001
        p1 = project_map["PRJ-2026-001"]
        milestones_p1 = [
            ProjectMilestone(project_id=p1.id, title="Baseline Ward Route Optimization & Logistics Survey", target_date=datetime(2025, 7, 31, tzinfo=timezone.utc), actual_date=datetime(2025, 8, 10, tzinfo=timezone.utc), status="Completed", delay_days=10),
            ProjectMilestone(project_id=p1.id, title="Secondary Waste Transfer Station Civil Foundation", target_date=datetime(2025, 12, 15, tzinfo=timezone.utc), actual_date=datetime(2026, 1, 5, tzinfo=timezone.utc), status="Completed", delay_days=21),
            ProjectMilestone(project_id=p1.id, title="Procurement Contract Award (PROC-2026-041)", target_date=datetime(2026, 3, 1, tzinfo=timezone.utc), actual_date=datetime(2026, 3, 12, tzinfo=timezone.utc), status="Completed", delay_days=11),
            ProjectMilestone(project_id=p1.id, title="Service Deployment of 35 Heavy Compactor Trucks", target_date=datetime(2026, 9, 15, tzinfo=timezone.utc), actual_date=None, status="Delayed", delay_days=66),
            ProjectMilestone(project_id=p1.id, title="Full Automated Fleet Telemetry & Central Dispatch", target_date=datetime(2026, 12, 31, tzinfo=timezone.utc), actual_date=None, status="Pending", delay_days=0),
        ]
        db.add_all(milestones_p1)
        db.flush()

        # -------------------------------------------------------------
        # 6. Seed EXACTLY 15 Public Procurement Records
        # Hero: PROC-2026-041 (৳18.5 Cr, Service Deployment delayed beyond Sept 2026)
        # -------------------------------------------------------------
        print("[+] Seeding exactly 15 Public Procurement Records...")
        proc_specs = [
            # 1. HERO PROCUREMENT: PROC-2026-041
            {
                "id": "proc-041",
                "ref": "PROC-2026-041",
                "prj_code": "PRJ-2026-001",
                "dept": "dept-procurement",
                "title": "Service Deployment",
                "category": "Goods & Specialized Vehicles",
                "contractor": "Consortium for Urban Environmental Logistics",
                "est_cr": 19.0,
                "amt_cr": 18.5, # ৳18.5 Cr
                "tender": datetime(2025, 11, 10, tzinfo=timezone.utc),
                "award": datetime(2026, 2, 20, tzinfo=timezone.utc),
                "start": datetime(2026, 3, 15, tzinfo=timezone.utc),
                "milestone": "Service Deployment",
                "planned_dt": datetime(2026, 9, 15, tzinfo=timezone.utc),
                "actual_dt": None,
                "status": "Delayed beyond September 2026",
                "delay_months": 4,
                "notes": "Milestone delayed. Requires review. Shipment import clearance and assembly line inspection delayed at Chittagong seaport.",
                "supporting": ["BILL-OF-LADING-CGP-8821", "CUSTOMS-CLEARANCE-NOTICE-DCSA", "SUPPLIER-FORCE-MAJEURE-QUERY"]
            },
            # 14 more realistic procurement contracts
            {"id": "proc-002", "ref": "PROC-2026-002", "prj_code": "PRJ-2026-002", "dept": "dept-procurement", "title": "Bituminous Surface Aggregates Lot 1", "category": "Works", "contractor": "National Highway Construction Ltd", "est_cr": 15.0, "amt_cr": 14.8, "tender": datetime(2025, 4, 1, tzinfo=timezone.utc), "award": datetime(2025, 5, 20, tzinfo=timezone.utc), "start": datetime(2025, 6, 1, tzinfo=timezone.utc), "milestone": "Subgrade Compaction", "planned_dt": datetime(2026, 5, 30, tzinfo=timezone.utc), "actual_dt": datetime(2026, 6, 5, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "Milestone achieved within contractual grace margin.", "supporting": []},
            {"id": "proc-003", "ref": "PROC-2026-003", "prj_code": "PRJ-2026-003", "dept": "dept-procurement", "title": "Pre-cast Reinforced Concrete Box Culverts", "category": "Goods", "contractor": "Bengal Precast Concrete Engineering", "est_cr": 12.5, "amt_cr": 12.2, "tender": datetime(2025, 7, 10, tzinfo=timezone.utc), "award": datetime(2025, 8, 25, tzinfo=timezone.utc), "start": datetime(2025, 9, 10, tzinfo=timezone.utc), "milestone": "Culvert Placement Segment 3", "planned_dt": datetime(2026, 7, 15, tzinfo=timezone.utc), "actual_dt": datetime(2026, 7, 20, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "Civil delivery confirmed.", "supporting": []},
            {"id": "proc-004", "ref": "PROC-2026-004", "prj_code": "PRJ-2026-004", "dept": "dept-procurement", "title": "Smart LED Luminaires with LoRaWAN Controllers", "category": "Goods", "contractor": "Green Energy Solutions BD", "est_cr": 8.0, "amt_cr": 7.8, "tender": datetime(2025, 2, 1, tzinfo=timezone.utc), "award": datetime(2025, 3, 5, tzinfo=timezone.utc), "start": datetime(2025, 3, 20, tzinfo=timezone.utc), "milestone": "Batch 2 Luminaire Mounting", "planned_dt": datetime(2026, 8, 30, tzinfo=timezone.utc), "actual_dt": datetime(2026, 8, 28, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "On schedule.", "supporting": []},
            {"id": "proc-005", "ref": "PROC-2026-005", "prj_code": "PRJ-2026-005", "dept": "dept-procurement", "title": "Secondary Transfer Station Hydraulic Compactors", "category": "Goods", "contractor": "Padma Heavy Machinery Syndicate", "est_cr": 14.0, "amt_cr": 13.9, "tender": datetime(2025, 4, 15, tzinfo=timezone.utc), "award": datetime(2025, 6, 1, tzinfo=timezone.utc), "start": datetime(2026, 6, 20, tzinfo=timezone.utc), "milestone": "Hydraulic Testing at Station 2", "planned_dt": datetime(2026, 8, 15, tzinfo=timezone.utc), "actual_dt": None, "status": "Delayed beyond August 2026", "delay_months": 3, "notes": "Milestone delayed. Electrical substation transformer tie-in pending.", "supporting": ["TRANSFORMER-GRID-NOTICE"]},
            {"id": "proc-006", "ref": "PROC-2026-006", "prj_code": "PRJ-2026-006", "dept": "dept-procurement", "title": "Submersible High-Capacity Water Extraction Pumps", "category": "Goods", "contractor": "AquaTech Engineering Works", "est_cr": 9.5, "amt_cr": 9.2, "tender": datetime(2025, 6, 1, tzinfo=timezone.utc), "award": datetime(2025, 7, 10, tzinfo=timezone.utc), "start": datetime(2025, 8, 1, tzinfo=timezone.utc), "milestone": "Pump Commissioning", "planned_dt": datetime(2026, 6, 30, tzinfo=timezone.utc), "actual_dt": datetime(2026, 7, 12, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "Commissioned.", "supporting": []},
            {"id": "proc-007", "ref": "PROC-2026-007", "prj_code": "PRJ-2026-007", "dept": "dept-procurement", "title": "Traffic Camera Edge Compute Nodes", "category": "Goods", "contractor": "CyberVision Bangladesh Ltd", "est_cr": 6.8, "amt_cr": 6.5, "tender": datetime(2025, 1, 15, tzinfo=timezone.utc), "award": datetime(2025, 2, 20, tzinfo=timezone.utc), "start": datetime(2025, 3, 10, tzinfo=timezone.utc), "milestone": "Phase 1 Edge Calibration", "planned_dt": datetime(2026, 5, 15, tzinfo=timezone.utc), "actual_dt": datetime(2026, 5, 14, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "Fully functional.", "supporting": []},
            {"id": "proc-008", "ref": "PROC-2026-008", "prj_code": "PRJ-2026-008", "dept": "dept-procurement", "title": "Khilgaon Canal Sheet Piling & Dredging", "category": "Works", "contractor": "Eastern Waterway Developers", "est_cr": 11.0, "amt_cr": 10.8, "tender": datetime(2025, 8, 1, tzinfo=timezone.utc), "award": datetime(2025, 9, 15, tzinfo=timezone.utc), "start": datetime(2025, 10, 1, tzinfo=timezone.utc), "milestone": "Sheet Piling Embankment", "planned_dt": datetime(2026, 6, 1, tzinfo=timezone.utc), "actual_dt": None, "status": "Delayed beyond June 2026", "delay_months": 5, "notes": "Milestone delayed. Heavy monsoon water levels impeded dredging access.", "supporting": ["MONSOON-HIGH-WATER-ADVISORY"]},
            {"id": "proc-009", "ref": "PROC-2026-009", "prj_code": "PRJ-2026-009", "dept": "dept-procurement", "title": "Citizen Experience UX/UI Application Development", "category": "Consulting Services", "contractor": "Apex Software Systems", "est_cr": 3.8, "amt_cr": 3.6, "tender": datetime(2025, 1, 10, tzinfo=timezone.utc), "award": datetime(2025, 2, 1, tzinfo=timezone.utc), "start": datetime(2025, 2, 15, tzinfo=timezone.utc), "milestone": "Production Deployment v1.0", "planned_dt": datetime(2026, 8, 15, tzinfo=timezone.utc), "actual_dt": datetime(2026, 8, 10, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "Completed.", "supporting": []},
            {"id": "proc-010", "ref": "PROC-2026-010", "prj_code": "PRJ-2026-010", "dept": "dept-procurement", "title": "Interlocking Tactile Concrete Pavers Lot 4", "category": "Goods", "contractor": "Modern Pavement Tech", "est_cr": 5.2, "amt_cr": 5.0, "tender": datetime(2025, 9, 1, tzinfo=timezone.utc), "award": datetime(2025, 10, 5, tzinfo=timezone.utc), "start": datetime(2025, 10, 25, tzinfo=timezone.utc), "milestone": "Tile Laying Section B", "planned_dt": datetime(2026, 7, 30, tzinfo=timezone.utc), "actual_dt": datetime(2026, 8, 15, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "Completed.", "supporting": []},
            {"id": "proc-011", "ref": "PROC-2026-011", "prj_code": "PRJ-2026-011", "dept": "dept-procurement", "title": "Trenchless Sewer Relining Equipment & Liners", "category": "Works", "contractor": "Sino-Bangla Underground Utility JV", "est_cr": 13.5, "amt_cr": 13.1, "tender": datetime(2025, 5, 20, tzinfo=timezone.utc), "award": datetime(2025, 6, 30, tzinfo=timezone.utc), "start": datetime(2025, 7, 20, tzinfo=timezone.utc), "milestone": "Relining Reach 4", "planned_dt": datetime(2026, 9, 30, tzinfo=timezone.utc), "actual_dt": None, "status": "In Progress", "delay_months": 1, "notes": "Under execution.", "supporting": []},
            {"id": "proc-012", "ref": "PROC-2026-012", "prj_code": "PRJ-2026-012", "dept": "dept-procurement", "title": "Ultrasonic Flow Meters for Bulk Mains", "category": "Goods", "contractor": "Precision Metering Tech", "est_cr": 6.5, "amt_cr": 6.3, "tender": datetime(2025, 3, 1, tzinfo=timezone.utc), "award": datetime(2025, 4, 10, tzinfo=timezone.utc), "start": datetime(2025, 4, 25, tzinfo=timezone.utc), "milestone": "Calibration Sign-off", "planned_dt": datetime(2026, 8, 31, tzinfo=timezone.utc), "actual_dt": datetime(2026, 8, 25, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "Completed.", "supporting": []},
            {"id": "proc-013", "ref": "PROC-2026-013", "prj_code": "PRJ-2026-013", "dept": "dept-procurement", "title": "Galvanized Octagonal Light Poles 12M", "category": "Goods", "contractor": "SteelFab Heavy Engineering", "est_cr": 3.2, "amt_cr": 3.1, "tender": datetime(2025, 2, 1, tzinfo=timezone.utc), "award": datetime(2025, 3, 1, tzinfo=timezone.utc), "start": datetime(2025, 3, 15, tzinfo=timezone.utc), "milestone": "Delivery of 400 Poles", "planned_dt": datetime(2026, 6, 15, tzinfo=timezone.utc), "actual_dt": datetime(2026, 6, 12, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "Completed.", "supporting": []},
            {"id": "proc-014", "ref": "PROC-2026-014", "prj_code": "PRJ-2026-014", "dept": "dept-procurement", "title": "Community Center Pre-Engineered Steel Superstructure", "category": "Works", "contractor": "Bengal Pre-Engineered Buildings", "est_cr": 8.0, "amt_cr": 7.8, "tender": datetime(2025, 7, 1, tzinfo=timezone.utc), "award": datetime(2025, 8, 15, tzinfo=timezone.utc), "start": datetime(2025, 9, 1, tzinfo=timezone.utc), "milestone": "Rafter Erection", "planned_dt": datetime(2026, 5, 30, tzinfo=timezone.utc), "actual_dt": None, "status": "Delayed beyond May 2026", "delay_months": 6, "notes": "Milestone delayed. Structural foundation redesign required.", "supporting": ["GEOTECH-SOIL-RETEST-REPORT"]},
            {"id": "proc-015", "ref": "PROC-2026-015", "prj_code": "PRJ-2026-015", "dept": "dept-procurement", "title": "Hyperconverged Storage Server Arrays", "category": "Goods", "contractor": "Smart Data Tech BD", "est_cr": 5.5, "amt_cr": 5.4, "tender": datetime(2025, 1, 20, tzinfo=timezone.utc), "award": datetime(2025, 2, 25, tzinfo=timezone.utc), "start": datetime(2025, 3, 10, tzinfo=timezone.utc), "milestone": "Rack Mounting & SAN Configuration", "planned_dt": datetime(2026, 7, 31, tzinfo=timezone.utc), "actual_dt": datetime(2026, 7, 28, tzinfo=timezone.utc), "status": "Completed", "delay_months": 0, "notes": "Operational.", "supporting": []},
        ]

        assert len(proc_specs) == 15, f"Expected 15 procurements, got {len(proc_specs)}"
        for pr in proc_specs:
            target_prj = project_map.get(pr["prj_code"])
            db.add(PublicProcurement(
                id=pr["id"],
                procurement_ref=pr["ref"],
                project_id=target_prj.id if target_prj else "prj-001",
                department_id=pr["dept"],
                title=pr["title"],
                procurement_category=pr["category"],
                contractor_name=pr["contractor"],
                estimated_amount_cr=pr["est_cr"],
                contract_amount_cr=pr["amt_cr"],
                tender_date=pr["tender"],
                award_date=pr["award"],
                contract_start_date=pr["start"],
                critical_milestone=pr["milestone"],
                milestone_planned_date=pr["planned_dt"],
                milestone_actual_date=pr["actual_dt"],
                status=pr["status"],
                delay_duration_months=pr["delay_months"],
                neutral_notes=pr["notes"],
                supporting_records=pr["supporting"]
            ))
        db.flush()

        # -------------------------------------------------------------
        # 7. Seed Monthly Ward Service Performance (Time-Series)
        # Months: Jun 2026 through Nov 2026 for all 12 wards
        # -------------------------------------------------------------
        print("[+] Seeding Monthly Service Performance Time-Series (12 Wards x 6 Months)...")
        months = ["Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026"]
        perf_records = []

        for w_num in range(1, 13):
            w_id = ward_map[w_num].id
            is_anomaly = w_num in anomaly_ward_nums

            for idx, m in enumerate(months):
                # Anomaly evolution: from Sep 2026 onward, performance drops by 14%, complaints rise 31%, resolution time rises 18%
                if is_anomaly and idx >= 3:  # Sep, Oct, Nov
                    w_avail = 72.0 - (idx - 3) * 2.5
                    w_comp_rate = 68.0 - (idx - 3) * 3.0
                    w_res_time = 3.6 + (idx - 3) * 0.4  # +18%
                    w_vol = 58 + (idx - 3) * 12        # +31%
                    w_backlog = 14 + (idx - 3) * 6
                    w_sat = 62.0 - (idx - 3) * 3.5
                    w_perf = 69.0 - (idx - 3) * 4.5     # -14% degradation
                else:
                    w_avail = 84.0 + rng.uniform(-1.5, 1.5)
                    w_comp_rate = 82.0 + rng.uniform(-2.0, 2.0)
                    w_res_time = 3.1 + rng.uniform(-0.3, 0.3)
                    w_vol = 38 + rng.randint(-4, 4)
                    w_backlog = 6 + rng.randint(-2, 2)
                    w_sat = 73.0 + rng.uniform(-2.0, 2.0)
                    w_perf = 81.0 + rng.uniform(-2.0, 2.0)

                perf_records.append(MonthlyServicePerformance(
                    ward_id=w_id,
                    service_category="Waste Collection",
                    month_period=m,
                    service_availability_pct=round(w_avail, 1),
                    service_completion_rate_pct=round(w_comp_rate, 1),
                    avg_resolution_time_days=round(w_res_time, 1),
                    complaint_volume=w_vol,
                    backlog_count=w_backlog,
                    service_satisfaction_score=round(w_sat, 1),
                    performance_percentage=round(w_perf, 1)
                ))

        db.bulk_save_objects(perf_records)
        db.flush()

        # -------------------------------------------------------------
        # 8. Seed Budget Allocations (Departments & Demonstration Cases)
        # -------------------------------------------------------------
        print("[+] Seeding Department & Project Budget Allocations...")
        budget_entries = []
        for d_id, name, code, lead, alloc, spent, prj_c, cmp_c in dept_specs:
            rel = round(alloc * 0.78, 1)
            rem = round(alloc - spent, 1)
            fin_p = round((spent / alloc) * 100, 1)
            phys_p = round(fin_p * 0.94, 1) # normal alignment
            var_p = round(fin_p - phys_p, 1)

            budget_entries.append(BudgetAllocation(
                department_id=d_id,
                project_id=None,
                fiscal_year="FY2025-2026",
                approved_allocation_cr=alloc,
                released_budget_cr=rel,
                expenditure_cr=spent,
                remaining_allocation_cr=rem,
                financial_progress_pct=fin_p,
                physical_progress_pct=phys_p,
                variance_pct=var_p,
                variance_label="Normal Departmental Execution"
            ))

        # Project 5 Demonstration variance case: 75% financial progress vs 39% physical progress
        prj5 = project_map["PRJ-2026-005"]
        budget_entries.append(BudgetAllocation(
            department_id="dept-public-works",
            project_id=prj5.id,
            fiscal_year="FY2025-2026",
            approved_allocation_cr=28.0,
            released_budget_cr=21.0,
            expenditure_cr=21.0,
            remaining_allocation_cr=7.0,
            financial_progress_pct=75.0,
            physical_progress_pct=39.0,
            variance_pct=36.0,
            variance_label="Financial-to-physical progress variance — Needs Review"
        ))

        db.bulk_save_objects(budget_entries)
        db.flush()

        # -------------------------------------------------------------
        # 9. Seed Hero Governance Signal & Secondary Signals
        # -------------------------------------------------------------
        print("[+] Seeding Hero Governance Signal & Operational Signals...")
        hero_signal = GovernanceSignal(
            id="sig-gov-2026-001",
            signal_code="SIG-GOV-2026-001",
            title="Waste Collection Service Degradation",
            description=(
                "Coordinated cross-data anomaly detected across Wards 2, 5, 8, and 12 showing a 31% surge in citizen waste "
                "complaints, an 18% increase in average resolution duration, and a 14% decline in service performance. "
                "The anomaly is temporally correlated with the delayed project 'Waste Management Service Improvement' (PRJ-2026-001) "
                "and procurement milestone 'Service Deployment' (PROC-2026-041) delayed beyond September 2026."
            ),
            category="Service Delivery & Operational Governance",
            priority="High Priority",
            severity="High",     # Severity band 51-75
            risk_score=74.0,     # Deterministic risk score
            ai_confidence=87.0,  # Separate AI evidence confidence indicator
            detection_time=now_dt - timedelta(days=2),
            affected_wards=["Ward 2", "Ward 5", "Ward 8", "Ward 12"],
            affected_departments=["Waste Management Department", "Procurement and Contract Management Department"],
            related_projects=["Waste Management Service Improvement (PRJ-2026-001)"],
            related_procurements=["PROC-2026-041 (Service Deployment)"],
            what_changed={
                "complaints_growth": "+31%",
                "resolution_time_delta": "+18%",
                "service_performance_drop": "-14%",
                "cluster_concentration": "78% across Wards 2, 5, 8, 12",
                "reporting_window": "Sep 2026 — Nov 2026"
            },
            score_breakdown={
                "severity_score": 28,
                "trend_strength": 19,
                "affected_population": 14,
                "persistence": 8,
                "evidence_confidence": 5,
                "total_risk_score": 74
            },
            possible_explanations=[
                "Delayed deployment of 35 heavy compactor vehicles under contract PROC-2026-041 resulting in vehicle availability shortage.",
                "Increased per-capita municipal waste generation during seasonal monsoon season creating secondary transfer capacity bottlenecks.",
                "Localized transit rerouting and infrastructure maintenance along arterial corridors connecting Wards 2, 5, 8, and 12 to Matuail landfill."
            ],
            alternative_explanations=[
                "Higher citizen adoption of newly launched mobile grievance reporting app inflating submission volume without proportional physical waste increase.",
                "Localized staff transition and roster restructuring at regional secondary transfer stations."
            ],
            limitations_and_unknowns=[
                "Contractor vehicle fleet telemetry and GPS real-time route logs for Q3 currently pending manual upload and verification.",
                "Sub-ward landfill weight bridge logs operate on 48-hour batch synchronization cycle."
            ],
            recommended_actions=[
                "Request a formal project milestone status review for Waste Management Service Improvement (PRJ-2026-001).",
                "Verify the Service Deployment procurement milestone with the contractor under contract PROC-2026-041.",
                "Review waste collection service coverage and deployment schedules in the four affected wards (Wards 2, 5, 8, 12).",
                "Examine complaint resolution backlog, shift allocation, and mechanical loader availability.",
                "Validate the causal relationship between project progress milestones and localized service outcomes.",
                "Prepare a follow-up service performance and evidentiary assessment for departmental leadership."
            ],
            evidence_graph={
                "nodes": [
                    {"id": "node-cmp", "label": "Citizen Complaints (+31%)", "type": "complaints", "count": 620},
                    {"id": "node-srv", "label": "Waste Service Metrics (-14%)", "type": "metrics", "status": "Degraded"},
                    {"id": "node-w12", "label": "Affected Wards (W2, W5, W8, W12)", "type": "wards", "count": 4},
                    {"id": "node-prj", "label": "PRJ-2026-001 (54% vs 80% Planned)", "type": "project", "status": "Delayed"},
                    {"id": "node-proc", "label": "PROC-2026-041 (৳18.5 Cr)", "type": "procurement", "milestone": "Delayed > Sep 2026"},
                    {"id": "node-bdg", "label": "Budget Allocation (৳50 Cr Approved)", "type": "budget", "released": "৳38 Cr"},
                    {"id": "node-sig", "label": "Governance Signal: SIG-GOV-2026-001", "type": "signal", "score": 74}
                ],
                "edges": [
                    {"source": "node-cmp", "target": "node-srv", "label": "Correlates With"},
                    {"source": "node-srv", "target": "node-w12", "label": "Localized In"},
                    {"source": "node-w12", "target": "node-prj", "label": "Covered By"},
                    {"source": "node-prj", "target": "node-proc", "label": "Contract Dependent"},
                    {"source": "node-proc", "target": "node-bdg", "label": "Disbursal Line"},
                    {"source": "node-prj", "target": "node-sig", "label": "Synthesized Signal"}
                ]
            },
            investigation_status="Ready for Investigation"
        )
        db.add(hero_signal)

        # Secondary Signals
        db.add(GovernanceSignal(
            id="sig-gov-2026-002",
            signal_code="SIG-GOV-2026-002",
            title="Secondary Transfer Station Capital Disbursement Variance",
            description="Project PRJ-2026-005 exhibits 75% financial expenditure disbursement against only 39% verified physical civil progress, requiring physical-to-financial variance review.",
            category="Financial & Budget Governance",
            priority="High Priority",
            severity="High",
            risk_score=62.0,
            ai_confidence=84.0,
            detection_time=now_dt - timedelta(days=5),
            affected_wards=["Ward 2", "Ward 12"],
            affected_departments=["Public Works Department", "Finance and Budget Department"],
            related_projects=["Secondary Transfer Station Modernization (PRJ-2026-005)"],
            related_procurements=["PROC-2026-005"],
            what_changed={"financial_progress": "75%", "physical_progress": "39%", "variance": "36 pp"},
            score_breakdown={"severity": 22, "trend": 16, "population": 12, "persistence": 8, "confidence": 4, "total_risk_score": 62},
            possible_explanations=["Equipment advance payment issued prior to site foundation readiness verification."],
            alternative_explanations=["Advance procurement of long-lead imported hydraulic machinery recorded in accounting ledger."],
            limitations_and_unknowns=["Vendor equipment delivery warehouse inspection voucher awaiting engineer signoff."],
            recommended_actions=["Request physical asset verification and inventory audit at regional storage yard."],
            evidence_graph={},
            investigation_status="Ready for Investigation"
        ))

        db.add(GovernanceSignal(
            id="sig-gov-2026-003",
            signal_code="SIG-GOV-2026-003",
            title="Monsoon Drainage Siltation & Desiltation Capacity Alert",
            description="Localized stormwater canal excavation delays in Ward 8 and Ward 9 show potential correlation with recurring post-monsoon localized ponding complaints.",
            category="Infrastructure & Climate Readiness",
            priority="Medium Priority",
            severity="Medium",
            risk_score=48.0,
            ai_confidence=79.0,
            detection_time=now_dt - timedelta(days=8),
            affected_wards=["Ward 8", "Ward 9"],
            affected_departments=["Drainage and Sewerage Department"],
            related_projects=["Khilgaon Stormwater Canal Excavation (PRJ-2026-008)"],
            related_procurements=["PROC-2026-008"],
            what_changed={"ponding_reports": "+18%", "dredging_progress": "48% vs 60% planned"},
            score_breakdown={"severity": 16, "trend": 14, "population": 10, "persistence": 5, "confidence": 3, "total_risk_score": 48},
            possible_explanations=["High monsoon river tide levels preventing continuous dredging barge positioning."],
            alternative_explanations=["Silt trap maintenance interval extended by municipal engineering contractor."],
            limitations_and_unknowns=["Water-level sensor telemetry missing for secondary canal tributary."],
            recommended_actions=["Deploy auxiliary de-watering mobile pumping unit to Khilgaon low-lying segments."],
            evidence_graph={},
            investigation_status="Ready for Investigation"
        ))

        db.flush()

        # -------------------------------------------------------------
        # 10. Seed Pre-Created Investigation & Append-Only Audit Log
        # -------------------------------------------------------------
        print("[+] Seeding Governance Investigation & SHA-256 Chained Audit Trail...")
        inv = GovernanceInvestigation(
            id="inv-2026-001",
            investigation_code="INV-2026-001",
            signal_id=hero_signal.id,
            title="Operational Inspection: Waste Collection Degradation in Wards 2, 5, 8 & 12",
            organization_name="Dhaka City Services Authority",
            responsible_department="Waste Management Department & Procurement Directorate",
            related_wards=["Ward 2", "Ward 5", "Ward 8", "Ward 12"],
            priority="High Priority",
            status="Under Review",
            assigned_to="Md. Tanvir Hossain",
            assigned_role="Super Administrator & Chief Governance Inspector",
            due_date=now_dt + timedelta(days=14),
            completion_criteria=(
                "1. Audit physical deployment schedule of 35 compactor trucks under PROC-2026-041.\n"
                "2. Conduct on-site spot inspection across Ward 2, 5, 8, and 12 secondary transfer stations.\n"
                "3. Verify root cause of 18% complaint resolution SLA extension.\n"
                "4. Submit evidentiary remediation briefing to Municipal Executive Board."
            ),
            evidence_records=[
                {"id": "EVD-CMP-CLUSTER-620", "type": "Citizen Complaints", "desc": "620 Verified complaints dataset with 78% four-ward concentration."},
                {"id": "EVD-PRJ-001-PROGRESS", "type": "Project Record", "desc": "PRJ-2026-001 54% actual physical progress verification document."},
                {"id": "EVD-PROC-041-MILESTONE", "type": "Procurement Contract", "desc": "PROC-2026-041 contract notice citing Service Deployment delay beyond Sep 2026."},
                {"id": "EVD-W12-SNAPSHOT", "type": "Ward Snapshot", "desc": "Ward 12 Governance Health 67 index report and service metrics."}
            ],
            checklist=[
                {"id": "chk-1", "label": "Review supplier customs clearance logs with Chittagong Port Authority", "completed": True, "verified_by": "Md. Tanvir Hossain"},
                {"id": "chk-2", "label": "Conduct Ward 12 field visit with Local Councillor & Chief Waste Engineer", "completed": True, "verified_by": "Fatin Sharhad"},
                {"id": "chk-3", "label": "Assess temporary night-shift deployment of backup fleet from Zone 1", "completed": False, "verified_by": None},
                {"id": "chk-4", "label": "Submit preliminary corrective action notice to procurement contractor", "completed": False, "verified_by": None},
                {"id": "chk-5", "label": "Prepare formal executive brief for Municipal Commissioner", "completed": False, "verified_by": None}
            ],
            proposed_actions=hero_signal.recommended_actions,
            comments=[
                {
                    "author": "Md. Tanvir Hossain",
                    "role": "Super Administrator",
                    "timestamp": (now_dt - timedelta(days=1, hours=4)).isoformat(),
                    "text": "Investigation initiated based on AI cross-correlation signal SIG-GOV-2026-001. All 4 ward records linked."
                },
                {
                    "author": "Fatin Sharhad",
                    "role": "Compliance Officer",
                    "timestamp": (now_dt - timedelta(hours=18)).isoformat(),
                    "text": "Preliminary port customs documentation reviewed. 14 compactor chassis cleared; remaining 21 awaiting customs inspection."
                }
            ],
            approval_history=[
                {
                    "step": "Investigation Initiation",
                    "approved_by": "Md. Tanvir Hossain",
                    "status": "Approved",
                    "timestamp": (now_dt - timedelta(days=1, hours=5)).isoformat()
                }
            ]
        )
        db.add(inv)
        db.flush()

        # Seed Append-Only Hash-Chained Audit Logs
        # Event 1: Genesis Block
        hash_0 = "0000000000000000000000000000000000000000000000000000000000000000"
        event1_data = f"EVENT_001|SIGNAL_DETECTED|{hero_signal.id}|{org.id}|SYSTEM"
        hash_1 = compute_sha256(f"{hash_0}|{event1_data}")
        log1 = GovernanceAuditLog(
            event_id="EVT-2026-GOV-001",
            entity_type="SIGNAL",
            entity_id=hero_signal.id,
            organization_id=org.id,
            actor_id="system-engine",
            actor_name="JurisNova Autonomous Analytics Engine",
            actor_role="Multi-Agent Governance Engine",
            event_type="SIGNAL_DETECTED",
            timestamp=now_dt - timedelta(days=2),
            details={"signal_code": hero_signal.signal_code, "risk_score": 74.0, "confidence": 87.0},
            previous_hash=hash_0,
            current_hash=hash_1
        )

        # Event 2: Investigation Created
        event2_data = f"EVENT_002|INVESTIGATION_CREATED|{inv.id}|{org.id}|tanvirpiyal@jurisnova.ai"
        hash_2 = compute_sha256(f"{hash_1}|{event2_data}")
        log2 = GovernanceAuditLog(
            event_id="EVT-2026-GOV-002",
            entity_type="INVESTIGATION",
            entity_id=inv.id,
            organization_id=org.id,
            actor_id="usr-super-admin-01",
            actor_name="Md. Tanvir Hossain",
            actor_role="Super Administrator",
            event_type="INVESTIGATION_CREATED",
            timestamp=now_dt - timedelta(days=1, hours=5),
            details={"investigation_code": inv.investigation_code, "signal_ref": hero_signal.signal_code},
            associated_evidence_ids=["EVD-CMP-CLUSTER-620", "EVD-PRJ-001-PROGRESS", "EVD-PROC-041-MILESTONE"],
            previous_hash=hash_1,
            current_hash=hash_2
        )

        # Event 3: Evidence Verified
        event3_data = f"EVENT_003|EVIDENCE_LINKED|{inv.id}|{org.id}|fatinwasi321@jurisnova.ai"
        hash_3 = compute_sha256(f"{hash_2}|{event3_data}")
        log3 = GovernanceAuditLog(
            event_id="EVT-2026-GOV-003",
            entity_type="EVIDENCE",
            entity_id=inv.id,
            organization_id=org.id,
            actor_id="usr-compliance-off-01",
            actor_name="Fatin Sharhad",
            actor_role="Compliance Officer",
            event_type="EVIDENCE_LINKED",
            timestamp=now_dt - timedelta(hours=18),
            details={"action": "Attached port customs entry voucher to investigation dossier."},
            associated_evidence_ids=["BILL-OF-LADING-CGP-8821"],
            previous_hash=hash_2,
            current_hash=hash_3
        )

        db.add_all([log1, log2, log3])
        db.commit()
        print("[+] Public Sector Governance Seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"[!] Error seeding governance dataset: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_governance_data()
