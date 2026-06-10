import logging
import sys
from typing import Any


def setup_logging(level: int = logging.INFO) -> None:
    """Configure structured logging for EchoShield."""

    class CustomFormatter(logging.Formatter):
        """Formatter that adds context to log records."""

        grey = "\x1b[38;21m"
        blue = "\x1b[38;5;39m"
        yellow = "\x1b[38;5;226m"
        red = "\x1b[38;5;196m"
        bold_red = "\x1b[31;1m"
        reset = "\x1b[0m"

        FORMATS = {
            logging.DEBUG: grey + "%(asctime)s — %(name)s — %(levelname)s — %(message)s" + reset,
            logging.INFO: blue + "%(asctime)s — %(name)s — %(levelname)s — %(message)s" + reset,
            logging.WARNING: yellow + "%(asctime)s — %(name)s — %(levelname)s — %(message)s" + reset,
            logging.ERROR: red + "%(asctime)s — %(name)s — %(levelname)s — %(message)s" + reset,
            logging.CRITICAL: bold_red + "%(asctime)s — %(name)s — %(levelname)s — %(message)s" + reset,
        }

        def format(self, record: logging.LogRecord) -> str:
            log_fmt = self.FORMATS.get(record.levelno)
            formatter = logging.Formatter(log_fmt, datefmt="%Y-%m-%d %H:%M:%S")
            return formatter.format(record)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(CustomFormatter())

    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # Set third-party loggers to WARNING
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.WARNING)
    logging.getLogger("transformers").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance."""
    return logging.getLogger(name)