from EventKit import EKEventStore
from datetime import datetime, timedelta

store = EKEventStore.alloc().init()
store.requestAccessToEntityType_completion_(0, lambda granted, error: None)
print("Grant Calendar access in the pop-up, then press Enter.")
input("Press Enter after granting...")

predicate = store.predicateForEventsWithStartDate_endDate_calendars_(
    datetime.now(), datetime.now() + timedelta(days=1), None
)
events = store.eventsMatchingPredicate_(predicate)
if events:
    for e in events:
        print(f"  {e.title()} — {e.startDate()}")
else:
    print("No events found for today.")
