import json
import os
import re
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Kya Karu? API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASE_DIR = os.path.join(BASE_DIR, "database")

AUTHORITIES_FILE = os.path.join(
    DATABASE_DIR,
    "authorities.json"
)

COMPLAINTS_FILE = os.path.join(
    DATABASE_DIR,
    "complaints.json"
)


# ============================================================
# DEFAULT AUTHORITY DATA
# ============================================================

DEFAULT_AUTHORITIES = {
    "water": {
        "domain": "Water Supply",
        "authority": "Vellore Municipal Corporation — Water Supply Division",
        "official_channel": "Vellore Municipal Corporation",
        "website": "https://www.tnurbantree.tn.gov.in/vellore/",
        "keywords": [
            "water",
            "pipeline",
            "tap",
            "leak",
            "water supply",
            "drinking water",
            "no water",
            "water shortage"
        ]
    },

    "electricity": {
        "domain": "Electricity",
        "authority": "TANGEDCO, Vellore Circle",
        "official_channel": "TANGEDCO",
        "website": "https://www.tangedco.org/",
        "keywords": [
            "electricity",
            "electric",
            "power",
            "current",
            "voltage",
            "transformer",
            "streetlight",
            "street light",
            "power cut",
            "outage",
            "billing"
        ]
    },

    "roads": {
        "domain": "Roads",
        "authority": "Vellore Municipal Corporation — Public Works Department",
        "official_channel": "Vellore Municipal Corporation",
        "website": "https://www.tnurbantree.tn.gov.in/vellore/",
        "keywords": [
            "road",
            "pothole",
            "potholes",
            "footpath",
            "pavement",
            "damaged road",
            "broken road",
            "street damage"
        ]
    },

    "waste": {
        "domain": "Waste Management",
        "authority": "Vellore Municipal Corporation — Sanitation Department",
        "official_channel": "Vellore Municipal Corporation",
        "website": "https://www.tnurbantree.tn.gov.in/vellore/",
        "keywords": [
            "garbage",
            "waste",
            "trash",
            "dump",
            "dumping",
            "sanitation",
            "uncollected",
            "rubbish",
            "garbage collection",
            "dirty",
            "sewage"
        ]
    },

    "cyber": {
        "domain": "Cyber Crime",
        "authority": "Tamil Nadu Cyber Crime Wing, Vellore",
        "official_channel": "National Cyber Crime Reporting Portal",
        "website": "https://cybercrime.gov.in/",
        "keywords": [
            "fraud",
            "scam",
            "cyber",
            "hack",
            "hacked",
            "phishing",
            "otp",
            "online fraud",
            "online scam",
            "cyber crime",
            "upi fraud",
            "bank fraud"
        ]
    }
}


# ============================================================
# LOAD AUTHORITIES DATABASE
# ============================================================

def load_authorities():
    authorities = DEFAULT_AUTHORITIES.copy()

    try:
        if os.path.exists(AUTHORITIES_FILE):
            with open(AUTHORITIES_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)

            if isinstance(data, dict):

                # Case 1:
                # {
                #   "water": {...},
                #   "electricity": {...}
                # }
                for key, value in data.items():
                    if isinstance(value, dict):
                        authorities[key] = {
                            **authorities.get(key, {}),
                            **value
                        }

            elif isinstance(data, list):

                # Case 2:
                # [
                #   {"category": "water", ...}
                # ]
                for item in data:
                    if not isinstance(item, dict):
                        continue

                    category = (
                        item.get("category")
                        or item.get("id")
                        or item.get("domain")
                    )

                    if category:
                        category = str(category).lower().replace(" ", "_")

                        authorities[category] = {
                            **authorities.get(category, {}),
                            **item
                        }

    except Exception as e:
        print("Could not load authorities.json:", e)

    return authorities


AUTHORITIES = load_authorities()


# ============================================================
# COMPLAINT CLASSIFICATION
# ============================================================

CATEGORY_KEYWORDS = {
    "water": [
        "water",
        "pipeline",
        "tap",
        "leak",
        "water supply",
        "drinking water",
        "no water",
        "water shortage"
    ],

    "electricity": [
        "electricity",
        "electric",
        "power",
        "current",
        "voltage",
        "transformer",
        "streetlight",
        "street light",
        "power cut",
        "outage",
        "billing"
    ],

    "roads": [
        "road",
        "pothole",
        "potholes",
        "footpath",
        "pavement",
        "damaged road",
        "broken road",
        "street damage"
    ],

    "waste": [
        "garbage",
        "waste",
        "trash",
        "dump",
        "dumping",
        "sanitation",
        "uncollected",
        "rubbish",
        "garbage collection",
        "dirty",
        "sewage"
    ],

    "cyber": [
        "fraud",
        "scam",
        "cyber",
        "hack",
        "hacked",
        "phishing",
        "otp",
        "online fraud",
        "online scam",
        "cyber crime",
        "upi fraud",
        "bank fraud"
    ]
}


def classify_text(text: str):
    text_lower = text.lower()

    scores = {}

    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0

        for keyword in keywords:
            if keyword in text_lower:
                score += 1

        scores[category] = score

    if not scores:
        return "general"

    best_category = max(
        scores,
        key=scores.get
    )

    if scores[best_category] == 0:
        return "general"

    return best_category


# ============================================================
# LOCATION DETECTION
# ============================================================

KNOWN_AREAS = [
    "Katpadi",
    "Sathuvachari",
    "Gandhi Nagar",
    "Bagayam",
    "Thorapadi",
    "Green Circle",
    "Officers Line",
    "Vellore Fort",
    "Ida Scudder Road",
    "Vellore"
]


def detect_location(text: str, supplied_location: str = ""):

    if supplied_location and supplied_location.strip():
        return supplied_location.strip()

    text_lower = text.lower()

    for area in KNOWN_AREAS:
        if area.lower() in text_lower:
            if area.lower() == "vellore":
                return "Vellore"

            return f"{area}, Vellore"

    return "Vellore"


# ============================================================
# AUTHORITY LOOKUP
# ============================================================

def get_authority(category: str):

    if category in AUTHORITIES:
        data = AUTHORITIES[category]

        return {
            "domain": (
                data.get("domain")
                or data.get("label")
                or category.replace("_", " ").title()
            ),

            "authority": (
                data.get("authority")
                or data.get("name")
                or "Relevant Government Authority"
            ),

            "official_channel": (
                data.get("official_channel")
                or data.get("officialChannel")
                or data.get("channel")
                or "Official Government Complaint Channel"
            ),

            "website": (
                data.get("website")
                or data.get("url")
                or "https://pgportal.gov.in/"
            )
        }

    return {
        "domain": "General Grievance",
        "authority": "Relevant Government Authority",
        "official_channel": "CPGRAMS",
        "website": "https://pgportal.gov.in/"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "Kya Karu? API"
    }


# ============================================================
# CLASSIFY COMPLAINT
# ============================================================

@app.post("/api/classify")
async def classify_complaint(
    description: str = Form(...),
    location: str = Form("")
):

    category = classify_text(description)

    detected_location = detect_location(
        description,
        location
    )

    authority_data = get_authority(category)

    if category == "general":

        reason = (
            "The complaint could not be confidently matched "
            "to one of the supported domains. The system "
            "therefore recommends using the general grievance "
            "channel rather than allowing the AI to independently "
            "select a government authority."
        )

        steps = [
            "Review the complaint details.",
            "Confirm the location.",
            "Use the recommended official grievance channel."
        ]

        confidence = "low"

    else:

        reason = (
            f"The complaint was identified as a "
            f"{authority_data['domain']} issue. "
            f"The location provided is {detected_location}. "
            f"The recommended authority is "
            f"{authority_data['authority']}."
        )

        steps = [
            "Review the structured complaint.",
            "Confirm the recommended authority.",
            "Submit the complaint through Kya Karu?.",
            "Track the complaint status."
        ]

        confidence = "high"

    return {
        "category": category,
        "domain": authority_data["domain"],
        "location": detected_location,
        "authority": authority_data["authority"],
        "reason": reason,
        "official_channel": authority_data["official_channel"],
        "website": authority_data["website"],
        "steps": steps,
        "confidence": confidence
    }


# ============================================================
# LOAD COMPLAINTS
# ============================================================

def load_complaints():

    try:
        if os.path.exists(COMPLAINTS_FILE):

            with open(
                COMPLAINTS_FILE,
                "r",
                encoding="utf-8"
            ) as f:

                data = json.load(f)

                if isinstance(data, list):
                    return data

    except Exception as e:
        print("Could not load complaints.json:", e)

    return []


# ============================================================
# SAVE COMPLAINTS
# ============================================================

def save_complaints(complaints):

    os.makedirs(
        DATABASE_DIR,
        exist_ok=True
    )

    with open(
        COMPLAINTS_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            complaints,
            f,
            indent=2,
            ensure_ascii=False
        )


# ============================================================
# REPORT COMPLAINT
#
# IMPORTANT:
# There are NO UploadFile or File parameters here.
# ============================================================

@app.post("/api/report")
async def report_complaint(
    description: str = Form(...),
    location: str = Form(...),
    anonymous: bool = Form(False)
):

    category = classify_text(description)

    detected_location = detect_location(
        description,
        location
    )

    authority_data = get_authority(category)

    complaints = load_complaints()

    complaint_id = (
        "KK"
        + datetime.now().strftime("%Y%m%d%H%M%S")
    )

    complaint = {
        "id": complaint_id,
        "description": description,
        "category": category,
        "domain": authority_data["domain"],
        "location": detected_location,
        "authority": authority_data["authority"],
        "official_channel": authority_data["official_channel"],
        "website": authority_data["website"],
        "anonymous": anonymous,
        "status": "Submitted",
        "created_at": datetime.now().isoformat()
    }

    complaints.append(complaint)

    save_complaints(complaints)

    return {
        "message": "Complaint submitted successfully.",
        "id": complaint_id,
        "category": category,
        "domain": authority_data["domain"],
        "location": detected_location,
        "authority": authority_data["authority"],
        "official_channel": authority_data["official_channel"],
        "website": authority_data["website"],
        "anonymous": anonymous,
        "status": "Submitted"
    }