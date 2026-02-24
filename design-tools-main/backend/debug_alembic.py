import traceback
import sys
from alembic.config import Config
from alembic import command

c = Config('alembic.ini')
try:
    command.current(c)
except Exception:
    traceback.print_exc(file=sys.stdout)
