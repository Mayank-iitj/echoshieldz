import asyncio
from typing import Optional
from dataclasses import dataclass
import logging

logger = logging.getLogger("echoshield.rag")

try:
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import Chroma
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.schema import Document
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False


@dataclass
class ScriptMatchResult:
    score: float
    template: Optional[str] = None
    matched_excerpt: Optional[str] = None


class ScamScriptMatcher:
    """
    RAG-based matcher: computes cosine similarity between
    incoming transcript and known scam script templates.
    Returns match score and template name.
    """

    def __init__(self, persist_dir: str = "./data/embeddings/chroma"):
        self.persist_dir = persist_dir
        self.embeddings = None
        self.vectorstore = None
        self.is_loaded = False
        self.match_threshold = 0.65

    def load(self):
        """Load ChromaDB vector store."""
        if not LANGCHAIN_AVAILABLE:
            logger.warning("langchain not installed, using fallback")
            return

        logger.info(f"Loading embeddings from {self.persist_dir}")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
            model_kwargs={"device": "cuda" if __import__("torch").cuda.is_available() else "cpu"}
        )

        try:
            self.vectorstore = Chroma(
                embedding_function=self.embeddings,
                persist_directory=self.persist_dir,
                collection_name="scam_scripts"
            )
            logger.info("ChromaDB loaded successfully")
        except Exception as e:
            logger.warning(f"Could not load ChromaDB: {e}. Creating new.")
            self.vectorstore = Chroma(
                embedding_function=self.embeddings,
                persist_directory=self.persist_dir,
                collection_name="scam_scripts"
            )

        self.is_loaded = True

    def index_scam_scripts(self, scripts: list[dict]):
        """
        Index known scam script templates into ChromaDB.
        scripts: [{"template_name": "SBI_KYC_V3", "scam_type": "KYC_FRAUD", "text": "..."}]
        """
        if not self.is_loaded:
            self.load()

        if not LANGCHAIN_AVAILABLE:
            logger.warning("langchain not available, skipping indexing")
            return

        docs = [
            Document(
                page_content=s["text"],
                metadata={"template_name": s["template_name"], "scam_type": s["scam_type"]}
            )
            for s in scripts
        ]

        self.vectorstore.add_documents(docs)
        self.vectorstore.persist()
        logger.info(f"Indexed {len(docs)} scam script templates.")

    async def match(self, transcript: str) -> ScriptMatchResult:
        """
        Match transcript against known scam scripts.
        """
        if not self.is_loaded:
            self.load()

        if not transcript or len(transcript.split()) < 5:
            return ScriptMatchResult(score=0.0, template=None, matched_excerpt=None)

        if not LANGCHAIN_AVAILABLE:
            return ScriptMatchResult(score=0.0, template=None, matched_excerpt=None)

        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(
            None,
            lambda: self.vectorstore.similarity_search_with_score(transcript, k=3)
        )

        if not results:
            return ScriptMatchResult(score=0.0, template=None, matched_excerpt=None)

        best_doc, best_score = results[0]

        # Chroma returns L2 distance; convert to similarity
        similarity = max(0.0, 1.0 - best_score)

        return ScriptMatchResult(
            score=round(similarity, 3),
            template=best_doc.metadata.get("template_name") if similarity > self.match_threshold else None,
            matched_excerpt=best_doc.page_content[:100] if similarity > self.match_threshold else None
        )

    def match_sync(self, transcript: str) -> ScriptMatchResult:
        """Synchronous version of match."""
        if not self.is_loaded:
            self.load()

        if not transcript or len(transcript.split()) < 5:
            return ScriptMatchResult(score=0.0, template=None, matched_excerpt=None)

        if not LANGCHAIN_AVAILABLE:
            return ScriptMatchResult(score=0.0, template=None, matched_excerpt=None)

        results = self.vectorstore.similarity_search_with_score(transcript, k=3)

        if not results:
            return ScriptMatchResult(score=0.0, template=None, matched_excerpt=None)

        best_doc, best_score = results[0]
        similarity = max(0.0, 1.0 - best_score)

        return ScriptMatchResult(
            score=round(similarity, 3),
            template=best_doc.metadata.get("template_name") if similarity > self.match_threshold else None,
            matched_excerpt=best_doc.page_content[:100] if similarity > self.match_threshold else None
        )


# Default scam script templates
DEFAULT_SCRIPTS = [
    {
        "template_name": "SBI_KYC_V1",
        "scam_type": "KYC_FRAUD",
        "text": "Namaste, main SBI bank se bol raha hoon. Aapka KYC incomplete hai. Abhi verify karo warna account band ho jayega. Aadhaar number share karo."
    },
    {
        "template_name": "SBI_KYC_V2",
        "scam_type": "KYC_FRAUD",
        "text": "Your SBI account KYC is pending. Update your KYC within 24 hours or your account will be blocked. Share your Aadhaar number and OTP."
    },
    {
        "template_name": "OTP_SHARE_V1",
        "scam_type": "OTP_THEFT",
        "text": "Hello, main bank officer bol raha hoon. Aapka account compromised hai. Verification ke liye OTP share karo jo abhi aapko aaya hai."
    },
    {
        "template_name": "OTP_SHARE_V2",
        "scam_type": "OTP_THEFT",
        "text": "This is HDFC Bank fraud department. We detected unauthorized access. Tell me the 6-digit OTP sent to your mobile to block the transaction."
    },
    {
        "template_name": "CBI_ARREST_V1",
        "scam_type": "FAKE_AUTHORITY",
        "text": "Main CBI inspector bol raha hoon. Aapke naam par arrest warrant hai. Mumbai Crime Branch se bol raha hoon. Digital arrest mein hain aap."
    },
    {
        "template_name": "TRAI_DISCONNECT_V1",
        "scam_type": "FAKE_AUTHORITY",
        "text": "This is TRAI calling. Your mobile number will be disconnected in 2 hours. Press 1 to speak to customer care immediately."
    },
    {
        "template_name": "UPI_REFUND_V1",
        "scam_type": "UPI_SCAM",
        "text": "Maine aapko galat UPI pe paise bhej diye ₹5000. Wapas karo please. Nahi toh police complaint karungi."
    },
    {
        "template_name": "UPI_CASHBACK_V1",
        "scam_type": "UPI_SCAM",
        "text": "You have won a cashback of ₹5000. Accept this UPI request to receive the money. Enter your MPIN to confirm."
    },
    {
        "template_name": "EMERGENCY_V1",
        "scam_type": "SYNTHETIC_URGENCY",
        "text": "Sirf 30 minute bacha hai. Abhi karo warna permanent block ho jayega. Last warning hai yeh. Police aayenge ghar."
    },
    {
        "template_name": "ACCOUNT_FREEZE_V1",
        "scam_type": "ACCOUNT_FREEZE",
        "text": "Your ICICI account has been frozen for suspicious activity. To unlock, verify your identity immediately. Share your details."
    }
]