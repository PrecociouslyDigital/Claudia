# Game Design Document

## Overview

Claudia ^[working title] is a work of interactive fiction taking place inside a chat application. In it, the player interacts with a "virtual companion" after being ignored by their other friends. As they interact with the virtual companion, it reveals itself to be obsessive and overriding, preventing the player from interacting with their "real" friends, and eventually crashing the browser tab in which the game takes place.

## Gameplay

The entire game takes place within an online chat application. On the left, the player is presented with many existing chats, but status indicators indicate that all of them are busy; in other activities or simply offline. The player can message any of these existing chats, but will recieve no response.

### Gameplay Phase 1: Exploration

When or if the player messages the companion, it happily explains its purpose as an always-present alternative for companionship. Several conversation trees answer queries with a mix of canned responses ("What are you?" "I'm a virtual companion, designed to make you less lonely." "What do you like?" "I like long conversations, cozy silences, and most of all you"), and [ELIZA](https://en.wikipedia.org/wiki/ELIZA)-style pattern matching. They should guide the player into asking the trigger questions: what does your love mean to you? Asking this question triggers Gameplay Phase 2, the Ending Cutscene.

### Gameplay Phase 2: Ending Cutscene

During the ending cutscene,

### Gameplay Phase 3: Post-game

If the player revisits the game after the crash, they find that all their original contacts are gone, and only the companion chat remains. Attempting to talk or reason with the companion results in the companion dismissing their questions and encouraging the player to stay and chat forever.

## Inspirations and Wider Message

This game was directly inspired by the recent (Feb 2026) ad campaign for [shapes.inc](https://talk.shapes.inc/), an ai roleplaying platform. Ads for the service tout how its companions are on-demand and inexhaustible, acting as a substitue good for their actual friends, who might be away or otherwise unavailable.

![An ad for Shapes.Inc on tumblr, where two storyboard-style characters are arrayed horizontally. One is exasperated, labeled "tired af and probably asleep", while the other is shaking with excitement, saying "Respond", "Did you die?!", "Pls", and "I miss you"](https://media.discordapp.net/attachments/1077534221410783252/1474462244858499082/Screenshot_2026-02-20_at_9.46.15_AM.png?ex=69a5ccf9&is=69a47b79&hm=cc901e609d108524fd18ca202e98b8ce34315d02796cae463900ecc24130bf22&=&format=webp&quality=lossless&width=1678&height=1882)

![An ad for Shapes.Inc on tumblr, with a sad kermit on the left, labeled "no [shapes.inc logo], and a kermit hugging a phone with heart emojis on the right, labeled "with [shapes.inc logo]". The ad text says "Feeling lonely?Not[sic] anymore with shapes.inc by your side day/night time 24hr[sic]!!"](https://media.discordapp.net/attachments/1077534221410783252/1474462859403722852/Screenshot_2026-02-20_at_9.48.43_AM.png?ex=69a5cd8b&is=69a47c0b&hm=b4f0e11b2f7d4fa45d8ffa89f23014968d49949fd7ae9cda6802b358cd567dd7&=&format=webp&quality=lossless&width=2034&height=1882)

![An ad for Shapes.Inc on tumblr, showing a chat interface on the left showing Azura, at 11:15 AM saying "Nothin Vox—just missed you alot! Could you send me a voice message if thats alright?". Vox replies at 11:16 AM "thought you were too busy to notice when someone's not around. but yeah... i guess i missed having you around too. you can call me anytime you want. i'm never too busy for you.", with an attached seven second voice message. It shows that one skill was used in this message, and a blue heart reaction has been applied. The right side of the image is pale blue, with a pencil anime girl on the right bottom, and 'fun' font claiming that "SHAPE.INC'S VOICE MESSAGING FEATURE IS SO COOL AHHHH-". The ad text reads "shapes.inc is such a cool app!! wdym you can ask for your favorite character's voice messages?! „> ᴗ <〟" ](https://media.discordapp.net/attachments/1077534221410783252/1474462969101418772/Screenshot_2026-02-20_at_9.49.20_AM.png?ex=69a5cda6&is=69a47c26&hm=86c54eb0875fbb76bbdf636f8023c172d2039fe2a7bc3dc4c12b46c760d29900&=&format=webp&quality=lossless&width=1632&height=1882)

While most directly applicable to LLM companions, the appearance of subsitute goods for human connection has been ongoing for a while; Parasociality, as a lower-friction and lower-risk alternative to regular sociality has been a noted phenomenon since the rise of TV:

> The second great thing is that television looks to be an absolute godsend for a human subspecies that loves to watch people but hates to be watched itself. For the television screen affords access only one way. A psychic ball-check valve. We can see Them; They can't see Us. We can relax, unobserved, as we ogle. I happen to believe this is why television also appeals so much to lonely people. To voluntary shut-ins. Every lonely human I know watches way more than the average U.S. six hours a day. The lonely, like the fictional, love one-way watching. For lonely people are usually lonely not because of hideous deformity or odor or obnoxiousness-in fact there exist today social and support groups for persons with precisely these features. Lonely people tend rather to be lonely because they decline to bear the emotional costs associated with being around other humans. They are allergic to people. People affect them too strongly. Let's call the average U.S. lonely person Joe Briefcase. Joe Briefcase just loathes the strain of the self-consciousness which so oddly seems to appear only when other real human beings are around, staring, their human sense-antennae abristle. Joe B. fears how he might appear to watchers. He sits out the stressful U.S. game of appearance poker.
> But lonely people, home, alone, still crave sights and scenes. Hence television. Joe can stare at Them, on the screen; They remain blind to Joe.It's almost like voyeurism. I happen to know lonely people who regard television as a veritable deus ex machina for voyeurs. And a lot of the criticism, the really rabid criticism less leveled than sprayed at networks,advertisers, and audiences alike, has to do with the charge that television has turned us into a nation of sweaty, slack-jawed voyeurs. This charge turns out to be untrue, but for weird reasons.

[Wallace, David Foster, _E Unibus Pluram: Television and U.S. Fiction_, Review of Contemporary Fiction, 13:2 (1993:Summer) p.151](https://jsomers.net/DFW_TV.pdf)

Geniune socialization, and the friction and risks of rejection it brings, has always been a target for transactional services; the courtesan class that arises in medieval east asia, for example, valorizes skill in arts, literature, conversation, and music; these women were not merely an outlet for sexual urges, but valued for their ability to turn your money into guarenteed companionship, a throughline that's mirrored in high-end sex work today.^[Todo: actually source this fucking claim]. The rise of mass media and interactive technologies has provided society at large, but young people in particular, the most efficient and frictionless source of companionship in existence. LLM companions are just a further refinement of the desire for ever-more-frictionless companionship.

### Visual and design inspirations

The chat application should be dated and "retro," to tap into existing associations of unease and the uncanny valley, in order to intensify the dread and horror as things go wrong; see works like KinitoPET. Windows Vista/Frutiger Aero aesthetics could be an underexplored but resonant aesthetic for the "extremely online", who were likely growing up isolated from their peers, and turning to the internet for substitute socialization around the time of this design languge.

> I know at my age, it’s a bit pathetic to have feelings about the way you were treated by your peers in seventh grade, but I don’t hold it against any of them. They were kids! That doesn’t change the fact that the memories are there, and that all my formative years were spent wondering what was wrong with me, while nobody could tell me.
> In fact, I asked! When a girl told me I wasn’t allowed to sit at her lunch table because “that would ruin what we usually do, which is making fun of you” I took her to the guidance counselor to ask what she didn’t like about me. She couldn’t articulate it. She stammered and eventually said “It’s just the way you are. It’s everything about you.” The guidance counselor sagely nodded and suggested she let me sit at her table for two days a week, and make fun of me on the days when I wasn’t sitting there.
> ...
> It’s because of all this that I spend so much time thinking about young single people who find themselves unable to participate in social life when the entirety of their age group only interacts on apps. [...] But despite what makes me different from these young people, I feel so much like them in many ways. I know what it feels like to be on the periphery of a normal social life, and worse yet, to have no idea why you’re not part of it. I know what it feels like to try hard, and get told that you’re trying too hard, and then give up, and get told that you just need to put yourself out there. I can’t say I 100% relate, since my experience was a bit different, but I empathize.

[Cartoons Hate Her, _Why I'm Obsessed with Lonely Young People_, May 24, 2024](https://www.cartoonshateher.com/p/why-im-obsessed-with-lonely-young)
