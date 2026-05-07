from app import app, db
from app.models import Teammate, EventCard

with app.app_context():
    # clear existing data so we don't get duplicates if run multiple times
    EventCard.query.delete()
    Teammate.query.delete()

    # --- Create teammates ---
    josh = Teammate(
        name='Josh',
        role='The Ghost',
        description='Disappears without warning. Last seen 4 days ago. May or may not resurface before the deadline.',
        image='josh.png',
        emoji='👻'
    )
    priya = Teammate(
        name='Priya',
        role='The Overachiever',
        description='Rewrites your work at 2am. Means well, but absolutely exhausting.',
        image='priya.png',
        emoji='🦅'
    )
    david = Teammate(
        name='David',
        role='The Slacker',
        description='Will submit something. Just lower your expectations... By a lot.',
        image='david.png',
        emoji='😴'
    )
    sheldon = Teammate(
        name='Sheldon',
        role='The Know-It-All',
        description="Insists they're always right and knows what they're doing but in reality… they don't.",
        image='sheldon.png',
        emoji='🤓'
    )
    lucy = Teammate(
        name='Lucy',
        role='The Social Butterfly',
        description="More interested in sharing memes than the fact that the deadline is within 3 days.",
        image='lucy.png',
        emoji='🦋'
    )

    db.session.add_all([josh, priya, david, sheldon, lucy])
    db.session.commit()