export const typewriterTags: string[] = [
	"Anger",
	"Apology",
  "Betrayal",
	"Blame",
  "Closure",
	"Confession",
  "Devotion",
  "Emptiness",
  "Fear",
	"Forgiveness",
	"Goodbye",
  "Gratitude",
  "Guilt",
  "Hate",
	"Heartbreak",
  "Hope",
  "Jealousy",
	"Love",
  "Longing",
  "Missing",
  "Nostalgia",
  "Obsession",
  "Passion",
  "Pride",
	"Regret",
	"Sadness",
  "Shame",
  "Thank You",
  "Vulnerability",
  "Yearning",
	"Other"
];

export const typewriterSubTags: Record<string, string[]> = {
  "Anger": ["angry_at_you", "angry_at_myself", "angry_at_situation", "not_angry_anymore"],
  "Apology": ["im_sorry", "you_should_be_sorry", "both_need_apologize", "im_not_sorry"],
  "Betrayal": ["you_betrayed_me", "i_betrayed_you", "mutual_betrayal", "trust_destroyed", "betrayal_by_friend"],
  "Blame": ["blame_you", "blame_myself", "both_to_blame", "no_one_to_blame"],
  "Confession": ["have_to_tell_you", "keep_secret", "i_was_wrong", "you_were_wrong", "both_made_mistakes"],
  "Devotion": ["devoted_to_you", "worship_your_existence", "you_are_my_religion", "unconditional_love", "would_die_for_you"],
  "Emptiness": ["empty_without_you", "hollow_inside", "void_in_heart", "numb_and_empty", "emptiness_consumes"],
  "Fear": ["afraid_losing_you", "afraid_commitment", "afraid_future", "not_afraid_anymore"],
  "Forgiveness": ["asking_forgiveness", "forgive_you", "cant_forgive", "forgive_myself", "need_forgive_each_other"],
  "Goodbye": ["goodbye_forever", "see_you_again", "im_leaving", "dont_leave", "need_part_ways"],
  "Gratitude": ["thank_everything", "thank_lessons", "grateful_us", "grateful_pain"],
  "Guilt": ["feel_guilty", "innocent", "you_should_guilty", "no_one_guilty", "both_guilty"],
  "Hate": ["hate_you", "hate_myself", "hate_what_we_became", "dont_hate_anymore", "i_cant_hate_you"],
  "Heartbreak": ["you_broke_heart", "broke_own_heart", "broke_each_other", "heart_healing"],
  "Hope": ["hope_for_us", "hope_you_return", "hope_for_healing", "hope_is_fading", "never_give_up_hope"],
  "Jealousy": ["jealous_of_you", "jealous_of_others", "you_jealous_of_me", "not_jealous_anymore"],
  "Love": ["love_you", "dont_love_anymore", "love_cant_be_together", "still_love", "never_loved"],
  "Longing": ["ache_for_you", "desperate_yearning", "craving_your_touch", "starving_for_you", "endless_desire"],
  "Missing": ["miss_you", "dont_miss_anymore", "miss_who_you_were", "miss_who_we_were", "miss_myself"],
  "Nostalgia": ["remember_good_times", "miss_our_past", "better_days", "golden_memories", "wish_we_could_go_back"],
  "Obsession": ["cant_stop_thinking", "consumed_by_you", "unhealthy_fixation", "obsessed_with_memories", "addicted_to_you"],
  "Passion": ["burning_desire", "wild_love", "fierce_attraction", "passionate_fire", "intense_connection"],
  "Pride": ["proud_of_us", "too_proud_to_beg", "swallowing_pride", "pride_before_fall", "damaged_pride"],
  "Regret": ["regret_everything", "no_regrets", "regret_not_trying", "regret_meeting", "both_have_regrets"],
  "Sadness": ["so_sad", "finding_happiness", "sad_what_lost", "sad_for_you", "sad_for_me"],
  "Shame": ["ashamed", "proud_myself", "you_should_ashamed", "both_should_ashamed", "no_one_ashamed"],
  "Thank You": ["thank_you", "no_thanks_needed", "thank_pain", "thank_memories", "thank_leaving"],
  "Vulnerability": ["opening_my_heart", "showing_weakness", "need_protection", "trust_you_completely", "exposed_and_fragile"],
  "Yearning": ["yearn_for_touch", "desperate_need", "soul_yearning", "yearning_for_past", "unfulfilled_yearning"],
  "Closure": ["need_answers", "dont_need_answers", "need_understand", "need_move_on", "need_closure", "never_got_closure", "seeking_closure", "closure_impossible", "found_own_closure"],
  "Other": ["other_feeling", "different_emotion", "something_else", "cant_explain", "complicated"]
};

export const typewriterPromptsBySubTag: Record<string, string[]> = {
  // Anger subcategories
  "angry_at_you": [
    "you taught me to bleed and called it love",
    "i swallowed storms for you you called it silence",
    "you broke the rules and blamed the game",
    "i tore myself open you just watched",
    "rage was the only language you understood"
  ],
  "angry_at_myself": [
    "i'm furious at the person i became for you",
    "anger burns brightest when directed inward",
    "i'm mad at myself for believing your lies",
    "self-rage is the hardest fire to put out",
    "i'm angry at my own stupidity"
  ],
  "angry_at_situation": [
    "this whole thing makes me furious",
    "i'm angry at how unfair life can be",
    "the situation itself deserves my rage",
    "i'm mad at the circumstances not you",
    "anger at fate is the most helpless kind"
  ],
  "not_angry_anymore": [
    "the fire inside me has finally died",
    "anger left when you did",
    "i'm too tired to be angry",
    "rage burned itself out",
    "anger was just another thing you took from me"
  ],

  // Apology subcategories
  "im_sorry": [
    "if sorry had weight i'd sink to reach you",
    "i hurt you trying not to lose you",
    "forgive me for being too much and not enough",
    "i stitched lies where truth should have lived",
    "if i could i'd rewrite every moment with care"
  ],
  "you_should_be_sorry": [
    "your apologies are too little too late",
    "sorry doesn't fix what you broke",
    "you should be the one saying sorry",
    "your sorry means nothing now",
    "i'm tired of waiting for your apology"
  ],
  "both_need_apologize": [
    "we both messed up and we both need to say sorry",
    "this isn't just on me or just on you",
    "we both owe each other apologies",
    "neither of us is innocent here",
    "we both need to own our mistakes"
  ],
  "im_not_sorry": [
    "i won't apologize for protecting myself",
    "sorry isn't something i feel right now",
    "i'm not sorry for walking away",
    "some things don't deserve apologies",
    "i'm done saying sorry for existing"
  ],

  // Blame subcategories
  "blame_you": [
    "you taught me to bleed and called it love",
    "you carried fire i carried ash",
    "you built cages and named them homes",
    "i held your sins like they were mine",
    "you made leaving look like salvation"
  ],
  "blame_myself": [
    "i broke myself before anyone else could",
    "blame carves me sharper each day",
    "i ruined what could've been whole",
    "my choices haunt like old scars",
    "i dug my own collapse"
  ],
  "both_to_blame": [
    "we both played our parts in this disaster",
    "neither of us is innocent",
    "we both made choices that led here",
    "blame belongs to both of us",
    "we both failed each other"
  ],
  "no_one_to_blame": [
    "sometimes things just fall apart",
    "blame doesn't help anyone heal",
    "this wasn't anyone's fault",
    "life happens and people change",
    "assigning blame won't fix anything"
  ],

  // Confession subcategories
  "have_to_tell_you": [
    "i loved you in ways i didn't have language for",
    "every version of me still chooses you first",
    "i never stopped writing your name inside prayers",
    "you're the secret i couldn't keep quiet",
    "my chest aches with truths unspoken"
  ],
  "keep_secret": [
    "some things are better left unsaid",
    "this secret will die with me",
    "i'll carry this to my grave",
    "some truths don't need to be shared",
    "this stays between me and my heart"
  ],
  "i_was_wrong": [
    "i made mistakes i can't undo",
    "i was wrong about everything",
    "my judgment failed me completely",
    "i was wrong to trust you",
    "i was wrong to stay so long"
  ],
  "you_were_wrong": [
    "you made choices that hurt us both",
    "you were wrong about what we had",
    "your decisions led us here",
    "you were wrong to leave",
    "you were wrong about me"
  ],
  "both_made_mistakes": [
    "we both messed up in different ways",
    "neither of us handled this right",
    "we both made poor choices",
    "we both share the blame",
    "we both failed at love"
  ],

  // Fear subcategories
  "afraid_losing_you": [
    "the thought of life without you terrifies me",
    "i'm scared of what comes after you",
    "losing you is my biggest fear",
    "i'm afraid of the emptiness you'll leave",
    "the fear of losing you keeps me awake"
  ],
  "afraid_commitment": [
    "commitment scares me more than loneliness",
    "i'm terrified of being tied down",
    "the idea of forever makes me panic",
    "i'm afraid of what commitment means",
    "commitment feels like a trap"
  ],
  "afraid_future": [
    "tomorrow scares me more than yesterday",
    "i'm terrified of what's coming",
    "the future feels like a dark room",
    "i'm afraid of what life has planned",
    "the unknown terrifies me"
  ],
  "not_afraid_anymore": [
    "fear lost its grip on me",
    "i'm finally free from my fears",
    "courage replaced my cowardice",
    "i'm not scared of anything now",
    "fear died when you left"
  ],

  // Forgiveness subcategories
  "asking_forgiveness": [
    "please forgive me for what i did",
    "i need your forgiveness to move on",
    "can you find it in your heart to forgive me",
    "i'm begging for your forgiveness",
    "forgiveness is all i ask for"
  ],
  "forgive_you": [
    "i let go of what hurt so i could hold myself",
    "i forgive you i'm still learning to forgive me",
    "some wounds heal once you stop pressing them",
    "i chose peace even when rage was easier",
    "forgiveness tastes bitter before it tastes free"
  ],
  "cant_forgive": [
    "some things are beyond forgiveness",
    "i'm not ready to forgive you yet",
    "forgiveness feels like betrayal to myself",
    "what you did is unforgivable",
    "i'll never be able to forgive you"
  ],
  "forgive_myself": [
    "i'm learning to forgive my own mistakes",
    "self-forgiveness is the hardest kind",
    "i forgive myself for staying so long",
    "i forgive myself for believing your lies",
    "i forgive myself for not leaving sooner"
  ],
  "need_forgive_each_other": [
    "forgiveness needs to go both ways",
    "we both need to let go of the past",
    "mutual forgiveness is the only way forward",
    "we need to forgive each other to heal",
    "forgiveness is a two-way street"
  ],

  // Goodbye subcategories
  "goodbye_forever": [
    "i'm leaving the door unlocked not open",
    "we ended softly so the noise wouldn't",
    "goodbye lingered longer than love did",
    "our last glance held a thousand endings",
    "walking away hurt less than staying still"
  ],
  "see_you_again": [
    "this isn't goodbye forever",
    "i'll see you on the other side",
    "until we meet again",
    "this is just a temporary farewell",
    "i'll see you when the time is right"
  ],
  "im_leaving": [
    "i'm walking away from this",
    "i'm choosing to leave",
    "i'm done with this chapter",
    "i'm moving on without you",
    "i'm leaving for my own sake"
  ],
  "dont_leave": [
    "please don't walk away",
    "stay with me a little longer",
    "don't leave me here alone",
    "i'm not ready for you to go",
    "please don't abandon me"
  ],
  "need_part_ways": [
    "it's time for us to go separate ways",
    "we need to walk different paths",
    "parting is the best thing for us both",
    "we need to let each other go",
    "separate paths lead to better destinations"
  ],

  // Gratitude subcategories
  "thank_everything": [
    "thank you for all the memories",
    "thank you for the time we shared",
    "thank you for being part of my story",
    "thank you for everything you gave me",
    "thank you for the journey we took together"
  ],
  "thank_lessons": [
    "thank you for teaching me about love",
    "thank you for the hard lessons learned",
    "thank you for showing me what i deserve",
    "thank you for the wisdom you gave me",
    "thank you for the growth you inspired"
  ],
  "grateful_us": [
    "i'm thankful for what we had",
    "i'm grateful for the love we shared",
    "i'm thankful for the connection we felt",
    "i'm grateful for the moments we created",
    "i'm thankful for the bond we formed"
  ],
  "grateful_pain": [
    "thank you for the pain that made me stronger",
    "i'm grateful for the hurt that taught me",
    "thank you for the suffering that shaped me",
    "i'm grateful for the wounds that healed me",
    "thank you for the pain that led to growth"
  ],

  // Guilt subcategories
  "feel_guilty": [
    "guilt weighs heavier than the truth",
    "i feel responsible for everything",
    "guilt keeps me awake at night",
    "i carry the weight of what i didn't do",
    "guilt whispers that everything is my fault"
  ],
  "innocent": [
    "i did nothing wrong",
    "i'm not to blame for this",
    "i'm innocent of the charges",
    "i didn't cause this pain",
    "i'm not responsible for what happened"
  ],
  "you_should_guilty": [
    "you're the one who should feel bad",
    "guilt belongs to you not me",
    "you should feel ashamed of yourself",
    "you're the guilty party here",
    "guilt is your burden to carry"
  ],
  "no_one_guilty": [
    "this isn't anyone's fault",
    "no one needs to feel guilty",
    "guilt doesn't help anyone",
    "we're all innocent here",
    "guilt serves no purpose"
  ],
  "both_guilty": [
    "we both carry our share of guilt",
    "we're both to blame",
    "we both feel responsible",
    "guilt belongs to both of us",
    "we both have things to feel bad about"
  ],

  // Hate subcategories
  "hate_you": [
    "i swallowed storms for you you called it silence",
    "you broke the rules and blamed the game",
    "i tore myself open you just watched",
    "rage was the only language you understood",
    "you left me burning with questions unanswered"
  ],
  "hate_myself": [
    "i hate the person i became for you",
    "i hate myself for staying so long",
    "i hate myself for believing your lies",
    "i hate myself for not leaving sooner",
    "i hate myself for loving you"
  ],
  "hate_what_we_became": [
    "i hate what we turned into",
    "i hate the mess we made",
    "i hate what we became together",
    "i hate the toxic thing we created",
    "i hate what we allowed ourselves to become"
  ],
  "dont_hate_anymore": [
    "hate burned itself out",
    "i'm too tired to hate you",
    "hate was just another emotion you took",
    "i don't have the energy to hate",
    "hate left when you did"
  ],
  "i_cant_hate_you": [
    "i try to hate you but my heart won't let me",
    "even when you hurt me i can't find hatred",
    "hating you would be hating part of myself",
    "my love for you makes hate impossible",
    "i want to hate you but i just can't"
  ],

  // Heartbreak subcategories
  "you_broke_heart": [
    "i held the future until it cracked in my hands",
    "your absence sits where air should be",
    "our story ended mid-sentence",
    "i sleep next to ghosts of us",
    "you left and time limps still"
  ],
  "broke_own_heart": [
    "i broke my heart by staying too long",
    "i broke my own heart by believing you",
    "i broke my heart by not leaving sooner",
    "i broke my heart by loving too much",
    "i broke my own heart by trusting you"
  ],
  "broke_each_other": [
    "we destroyed each other slowly",
    "we broke each other's hearts",
    "we shattered what we had together",
    "we broke each other in different ways",
    "we were each other's destruction"
  ],
  "heart_healing": [
    "my heart is slowly mending",
    "healing takes time but it's happening",
    "my heart is learning to beat again",
    "healing is a slow process",
    "my heart is finding its way back"
  ],

  // Jealousy subcategories
  "jealous_of_you": [
    "i'm jealous of your happiness",
    "i'm jealous of your freedom",
    "i'm jealous of your new life",
    "i'm jealous of your ability to move on",
    "i'm jealous of your peace"
  ],
  "jealous_of_others": [
    "i'm jealous of people who have what i lost",
    "i'm jealous of happy couples",
    "i'm jealous of people who don't know heartbreak",
    "i'm jealous of those who found love",
    "i'm jealous of people who don't understand pain"
  ],
  "you_jealous_of_me": [
    "your jealousy shows in everything you do",
    "you're jealous of my strength",
    "you're jealous of my ability to heal",
    "you're jealous of my independence",
    "you're jealous of my peace"
  ],
  "not_jealous_anymore": [
    "jealousy lost its grip on me",
    "i'm not jealous of anything now",
    "jealousy burned itself out",
    "i'm content with what i have",
    "jealousy died with our relationship"
  ],

  // Love subcategories
  "love_you": [
    "you make time forget its job around me",
    "if i had a forever i'd spend it in your quiet",
    "love found me when i wasn't looking",
    "you soften the weight of being alive",
    "i fall for you in every lifetime"
  ],
  "dont_love_anymore": [
    "love died slowly and painfully",
    "i don't love you like i used to",
    "love left when you did",
    "i'm not in love with you anymore",
    "love burned itself out"
  ],
  "love_cant_be_together": [
    "i love you but we can't be together",
    "love isn't enough to fix us",
    "i love you but it's not healthy",
    "i love you but we're toxic",
    "i love you but we need to part"
  ],
  "still_love": [
    "my love for you hasn't faded",
    "i still love you despite everything",
    "love persists even through pain",
    "i still love you even now",
    "my heart still belongs to you"
  ],
  "never_loved": [
    "what i felt wasn't love",
    "i never truly loved you",
    "love was never part of this",
    "i was fooling myself about love",
    "love was never real between us"
  ],

  // Missing subcategories
  "miss_you": [
    "i keep a chair out for conversations that never arrive",
    "even the walls don't answer anymore",
    "emptiness walks me to sleep",
    "the quiet tastes heavier at night",
    "solitude presses harder than hands"
  ],
  "dont_miss_anymore": [
    "missing you faded with time",
    "i don't miss you like i used to",
    "missing you stopped hurting",
    "i'm over missing you",
    "missing you became a habit i broke"
  ],
  "miss_who_you_were": [
    "i miss the person you used to be",
    "i miss the version of you i fell in love with",
    "i miss who you were before everything changed",
    "i miss the person you pretended to be",
    "i miss the you that never really existed"
  ],
  "miss_who_we_were": [
    "i miss the couple we used to be",
    "i miss the us that felt invincible",
    "i miss the relationship we had",
    "i miss the dynamic we shared",
    "i miss the team we used to be"
  ],
  "miss_myself": [
    "i miss the person i was before you",
    "i miss who i used to be",
    "i miss the me that existed before this",
    "i miss my old self",
    "i miss the person i lost along the way"
  ],

  // Regret subcategories
  "regret_everything": [
    "i chose the right words and said them too late",
    "i kept the peace and lost the truth",
    "regret chews quietly never full",
    "i should've stayed when i left",
    "my silence cost me everything"
  ],
  "no_regrets": [
    "every choice led me here",
    "i don't regret a single moment",
    "regrets are a waste of time",
    "i'm grateful for every experience",
    "no regrets only lessons learned"
  ],
  "regret_not_trying": [
    "i should've fought harder for us",
    "i regret not putting in more effort",
    "i wish i'd tried harder to make it work",
    "i regret not giving it my all",
    "i should've tried harder to save us"
  ],
  "regret_meeting": [
    "meeting you was my biggest mistake",
    "i wish our paths had never crossed",
    "i regret the day i met you",
    "meeting you ruined my life",
    "i regret ever knowing you"
  ],
  "both_have_regrets": [
    "we both made mistakes we regret",
    "we both have things we wish we'd done differently",
    "we both carry our own regrets",
    "we both have things we'd change",
    "we both have regrets about us"
  ],

  // Sadness subcategories
  "so_sad": [
    "some days i'm just rain without a storm",
    "i miss me most when i miss you",
    "tears stain even when unseen",
    "grief sits heavy in morning light",
    "the ache lingers uninvited but constant"
  ],
  "finding_happiness": [
    "happiness is slowly returning",
    "i'm learning to be happy again",
    "joy is finding its way back",
    "i'm discovering happiness in new places",
    "happiness is a choice i'm making"
  ],
  "sad_what_lost": [
    "i'm sad about what we could have been",
    "i'm sad for the future we planned",
    "i'm sad for the dreams we shared",
    "i'm sad for the love we lost",
    "i'm sad for the memories we won't make"
  ],
  "sad_for_you": [
    "i'm sad about what you're missing",
    "i'm sad for the person you could have been",
    "i'm sad about the choices you made",
    "i'm sad for the pain you're in",
    "i'm sad for the life you're living"
  ],
  "sad_for_me": [
    "i'm sad about what i lost",
    "i'm sad for the person i became",
    "i'm sad about the time i wasted",
    "i'm sad for the love i gave away",
    "i'm sad for the future i lost"
  ],

  // Shame subcategories
  "ashamed": [
    "i hide in shadows of my own making",
    "shame wraps around me like a second skin",
    "i feel unworthy of the light",
    "my mistakes echo louder than my successes",
    "i carry guilt like a backpack of stones"
  ],
  "proud_myself": [
    "i'm proud of how far i've come",
    "i'm proud of my strength",
    "i'm proud of my ability to heal",
    "i'm proud of who i've become",
    "i'm proud of my resilience"
  ],
  "you_should_ashamed": [
    "you should be ashamed of your behavior",
    "you should feel ashamed of what you did",
    "shame belongs to you not me",
    "you should be ashamed of yourself",
    "you should feel ashamed of your choices"
  ],
  "both_should_ashamed": [
    "we both have reasons to feel ashamed",
    "we should both be ashamed of what we became",
    "shame belongs to both of us",
    "we both have things to be ashamed of",
    "we should both feel ashamed of us"
  ],
  "no_one_ashamed": [
    "shame serves no purpose here",
    "no one needs to feel ashamed",
    "shame doesn't help anyone heal",
    "we're all human and make mistakes",
    "shame is unnecessary and unhelpful"
  ],

  // Thank You subcategories
  "thank_you": [
    "thank you for the moments you didn't know mattered",
    "gratitude fills the spaces you left behind",
    "i'm thankful for the lessons you taught me",
    "thank you for showing me what love isn't",
    "i'm grateful for the strength you forced me to find"
  ],
  "no_thanks_needed": [
    "you don't need to thank me",
    "thanks aren't necessary",
    "no thanks required",
    "you don't owe me thanks",
    "thanks aren't needed here"
  ],
  "thank_pain": [
    "thank you for the pain that made me stronger",
    "thank you for the hurt that taught me",
    "thank you for the suffering that shaped me",
    "thank you for the wounds that healed me",
    "thank you for the pain that led to growth"
  ],
  "thank_memories": [
    "thank you for all the good times",
    "thank you for the memories we created",
    "thank you for the moments we shared",
    "thank you for the experiences we had",
    "thank you for the stories we wrote together"
  ],
  "thank_leaving": [
    "thank you for walking away",
    "thank you for setting me free",
    "thank you for ending what needed to end",
    "thank you for the gift of leaving",
    "thank you for choosing to go"
  ],

  // Closure subcategories
  "need_answers": [
    "i need to know why this happened",
    "i need answers to move forward",
    "i need to understand what went wrong",
    "i need answers to find peace",
    "i need to know the truth"
  ],
  "dont_need_answers": [
    "answers won't change anything",
    "i don't need to know why",
    "answers aren't necessary anymore",
    "i don't need explanations",
    "answers won't help me heal"
  ],
  "need_understand": [
    "i need to understand what happened",
    "i need to understand why you left",
    "i need to understand where we went wrong",
    "i need to understand to move on",
    "i need to understand to heal"
  ],
  "need_move_on": [
    "i need to let go and move forward",
    "i need to move on from this",
    "i need to leave this behind me",
    "i need to move on to better things",
    "i need to move on for my own sake"
  ],
  "need_closure": [
    "we both need closure to move forward",
    "we need closure to heal properly",
    "we need closure to find peace",
    "we need closure to let go",
    "we need closure to end this chapter"
  ],
  "never_got_closure": [
    "closure was something you never gave me",
    "i'm still waiting for the closure i deserve",
    "closure is the one thing i never received",
    "i never got the answers i needed",
    "closure remains elusive and painful"
  ],
  "seeking_closure": [
    "i'm actively looking for closure",
    "i'm searching for answers everywhere",
    "i'm seeking closure in any way i can",
    "closure is what i'm desperately seeking",
    "i'm on a quest for closure"
  ],
  "closure_impossible": [
    "closure seems completely out of reach",
    "getting closure feels like an impossible dream",
    "closure feels like something i'll never achieve",
    "the idea of closure feels hopeless",
    "closure feels like an unattainable goal"
  ],
  "found_own_closure": [
    "i had to create my own closure",
    "i found closure within myself",
    "i made my own peace without you",
    "closure came from within not from you",
    "i found closure on my own terms"
  ],

  // Other subcategories
  "other_feeling": [
    "i don't have a word for this but it feels true",
    "some feelings don't fit labels they still fit us",
    "this emotion is too complex to name",
    "i feel something i can't describe",
    "this feeling defies categorization"
  ],
  "different_emotion": [
    "this isn't what i expected to feel",
    "my emotions are all mixed up",
    "i feel something completely different",
    "this emotion surprised me",
    "i'm feeling something new and strange"
  ],
  "something_else": [
    "there's something else going on here",
    "this is about more than what it seems",
    "there's something deeper happening",
    "this isn't the whole story",
    "there's something else i need to say"
  ],
  "cant_explain": [
    "i don't know how to explain this",
    "words fail me right now",
    "i can't put this into words",
    "this feeling is beyond explanation",
    "i'm at a loss for words"
  ],
  "complicated": [
    "this situation is more complex than it seems",
    "nothing about this is simple",
    "it's more complicated than i can explain",
    "this isn't black and white",
    "the truth is somewhere in between"
  ],

  // Devotion subcategories
  "devoted_to_you": [
    "you are my prayer my temple my truth",
    "i would worship at the altar of your existence",
    "devotion runs deeper than blood through my veins",
    "you are the only religion i understand",
    "i am devoted to you beyond reason or logic"
  ],
  "worship_your_existence": [
    "i worship the ground you walk on",
    "your existence is my sacred text",
    "i would kneel at the altar of your being",
    "you are the god i never knew i needed",
    "your presence is my holy communion"
  ],
  "you_are_my_religion": [
    "you are my faith my church my salvation",
    "i found god in the way you say my name",
    "you are the only prayer i know by heart",
    "your love is my scripture and my hymn",
    "you are my religion and i am your disciple"
  ],
  "unconditional_love": [
    "my love for you knows no bounds or conditions",
    "i love you without limits or expectations",
    "unconditional is the only way i know how to love you",
    "my love for you is pure and without requirement",
    "i love you completely and without reservation"
  ],
  "would_die_for_you": [
    "i would die a thousand deaths for you",
    "your life matters more than my own",
    "i would sacrifice everything for your happiness",
    "dying for you would be my greatest honor",
    "i would give my life to save yours"
  ],

  // Hope subcategories
  "hope_for_us": [
    "hope whispers that we're not finished yet",
    "i still believe in the possibility of us",
    "hope keeps a candle burning in my window",
    "i hope we find our way back to each other",
    "hope tells me this isn't the end of our story"
  ],
  "hope_you_return": [
    "i hope you come back to me",
    "i hope you realize what you lost",
    "i hope you remember what we had",
    "i hope you find your way home to me",
    "i hope you choose me in the end"
  ],
  "hope_for_healing": [
    "i hope we both find peace",
    "i hope time heals what hurt us",
    "i hope we both learn to love again",
    "i hope healing finds us where we are",
    "i hope we both find what we're looking for"
  ],
  "hope_is_fading": [
    "hope is slipping through my fingers",
    "i'm losing hope for what we could be",
    "hope feels like a dying ember",
    "my hope is running out",
    "hope is becoming harder to hold onto"
  ],
  "never_give_up_hope": [
    "i will never stop hoping for us",
    "hope is all i have left and i'm keeping it",
    "i refuse to let hope die",
    "hope is the last thing i'll surrender",
    "i will hope for you until my final breath"
  ],

  // Longing subcategories
  "ache_for_you": [
    "my bones ache with missing you",
    "i ache for you in places i didn't know existed",
    "the ache for you lives in my marrow",
    "you left an ache that nothing else can fill",
    "i ache for you like drought aches for rain"
  ],
  "desperate_yearning": [
    "i yearn for you with desperate intensity",
    "yearning for you consumes every thought",
    "my yearning for you borders on madness",
    "i yearn for you like a drowning person yearns for air",
    "yearning for you is my constant companion"
  ],
  "craving_your_touch": [
    "i crave your touch like addiction",
    "my skin remembers your hands",
    "i hunger for your touch",
    "craving your touch is my daily torment",
    "your touch is the drug i can't quit"
  ],
  "starving_for_you": [
    "i am starving for your presence",
    "you are the feast i can never have",
    "i starve for you in a world full of emptiness",
    "starving for you is my natural state",
    "you are the sustenance my soul craves"
  ],
  "endless_desire": [
    "my desire for you knows no end",
    "desire burns eternal in my chest",
    "i desire you with the force of hurricanes",
    "endless desire is my burden and my gift",
    "desire for you flows like an endless river"
  ],

  // Nostalgia subcategories
  "remember_good_times": [
    "i remember when love was easy between us",
    "i remember the way you used to look at me",
    "i remember when we believed in forever",
    "i remember the laughter that lived in our hearts",
    "i remember when we were golden"
  ],
  "miss_our_past": [
    "i miss the people we used to be",
    "i miss the life we built together",
    "i miss the dreams we shared",
    "i miss the way we used to love",
    "i miss the past version of us"
  ],
  "better_days": [
    "we had better days than these",
    "i remember when everything was easier",
    "better days feel like a distant dream",
    "i long for the better days we shared",
    "better days remind me what we lost"
  ],
  "golden_memories": [
    "our golden memories shine in the darkness",
    "golden memories are all i have left",
    "i polish our golden memories like treasures",
    "golden memories haunt my quiet moments",
    "our golden memories feel like fairy tales now"
  ],
  "wish_we_could_go_back": [
    "i wish we could go back to the beginning",
    "i wish we could rewind and start over",
    "i wish we could go back to when love was enough",
    "i wish we could go back to simpler times",
    "i wish we could go back and do it right"
  ],

  // Vulnerability subcategories
  "opening_my_heart": [
    "i'm opening my heart despite the risk",
    "here is my heart raw and unguarded",
    "opening my heart to you terrifies me",
    "i offer you my heart with trembling hands",
    "my heart opens like a flower in your presence"
  ],
  "showing_weakness": [
    "i'm showing you my weakness",
    "vulnerability is my greatest strength",
    "i'm weak for you and i don't care who knows",
    "showing weakness takes more courage than hiding",
    "my weakness for you is my truth"
  ],
  "need_protection": [
    "i need you to protect my fragile heart",
    "please be gentle with what i'm giving you",
    "i need shelter from the storm",
    "protect me from my own tender places",
    "i need you to guard what i'm showing you"
  ],
  "trust_you_completely": [
    "i trust you with every piece of me",
    "complete trust is my gift to you",
    "i trust you even when it scares me",
    "trusting you completely is my leap of faith",
    "my trust in you is absolute and unwavering"
  ],
  "exposed_and_fragile": [
    "i am exposed and fragile before you",
    "here i am naked in my truth",
    "fragile is how i feel in your presence",
    "i am glass in your careful hands",
    "exposed and vulnerable is my offering to you"
  ],

  // Betrayal subcategories
  "you_betrayed_me": [
    "trust shattered into a thousand pieces",
    "you stabbed me with the knife i handed you",
    "betrayal tastes like copper and broken promises",
    "you wore my secrets like weapons against me",
    "you broke the sacred trust between us"
  ],
  "i_betrayed_you": [
    "i am the knife that cut too deep",
    "i betrayed the trust you gave so freely",
    "i am the villain in our love story",
    "i broke the promise i swore to keep",
    "i betrayed myself by betraying you"
  ],
  "mutual_betrayal": [
    "we both wielded secrets like daggers",
    "we betrayed each other in different ways",
    "we destroyed trust from both sides",
    "betrayal was the language we both spoke",
    "we both broke what we swore to protect"
  ],
  "trust_destroyed": [
    "trust died slowly then all at once",
    "what we built in years crumbled in moments",
    "trust is the casualty of our war",
    "we destroyed something irreplaceable",
    "trust lies in ruins between us"
  ],
  "betrayal_by_friend": [
    "friendship died when loyalty left",
    "you chose sides and it wasn't mine",
    "friendship became a casualty of your choices",
    "you betrayed the bond we thought unbreakable",
    "friendship meant nothing when push came to shove"
  ],

  // Emptiness subcategories
  "empty_without_you": [
    "you took yourself and left me hollow",
    "emptiness echoes where you used to be",
    "i am a shell of who i was with you",
    "you left and took my wholeness with you",
    "empty rooms remind me of empty hearts"
  ],
  "hollow_inside": [
    "hollowness lives where my heart should be",
    "i am carved out and echoing",
    "hollow is the sound of my name without you",
    "i am empty space pretending to be person",
    "hollowness fills every corner of my being"
  ],
  "void_in_heart": [
    "there's a you-shaped void in my chest",
    "the void grows larger every day",
    "my heart is a black hole where you used to be",
    "void is the only word for this absence",
    "the void consumes everything good"
  ],
  "numb_and_empty": [
    "numbness is my default setting now",
    "i feel nothing which is worse than everything",
    "empty and numb is my natural state",
    "numbness protects me from the emptiness",
    "i am void of feeling void of you"
  ],
  "emptiness_consumes": [
    "emptiness eats me from the inside out",
    "the void grows hungrier each day",
    "emptiness is a living thing inside me",
    "i am being consumed by my own absence",
    "emptiness feeds on what's left of me"
  ],

  // Obsession subcategories
  "cant_stop_thinking": [
    "you live rent-free in my mind",
    "thoughts of you circle like vultures",
    "i can't stop replaying our memories",
    "you haunt every quiet moment",
    "my mind is a broken record of you"
  ],
  "consumed_by_you": [
    "you consume my every waking thought",
    "i am drowning in thoughts of you",
    "you are the fire that burns through everything",
    "consumed is too gentle a word for this",
    "you devour me from the inside out"
  ],
  "unhealthy_fixation": [
    "my obsession with you is toxic",
    "i know this fixation is destroying me",
    "unhealthy doesn't begin to describe this",
    "i'm addicted to the pain of wanting you",
    "this obsession is my beautiful disease"
  ],
  "obsessed_with_memories": [
    "i replay our past like a broken film",
    "memories of you are my drug of choice",
    "i'm addicted to what we used to be",
    "our memories are my beautiful prison",
    "i live in the past where you still loved me"
  ],
  "addicted_to_you": [
    "you are my drug my poison my cure",
    "withdrawal from you is killing me slowly",
    "you're the addiction i can't quit",
    "i need you like lungs need air",
    "addiction to you runs through my veins"
  ],

  // Passion subcategories
  "burning_desire": [
    "desire burns through me like wildfire",
    "i burn for you in ways that scare me",
    "passion ignites every time you're near",
    "desire consumes me body and soul",
    "i am flame and you are gasoline"
  ],
  "wild_love": [
    "our love was untamed and dangerous",
    "wild is the only way i know how to love",
    "you brought out the animal in me",
    "we loved like wolves love the moon",
    "wild love leaves beautiful scars"
  ],
  "fierce_attraction": [
    "attraction pulls me like gravity",
    "you are magnetic and i am metal",
    "fierce doesn't capture this pull",
    "attraction defies logic and reason",
    "you draw me like moth to flame"
  ],
  "passionate_fire": [
    "passion burns brighter than reason",
    "we are fire and gasoline",
    "passion consumes everything in its path",
    "our fire burned too bright to last",
    "passion is the flame that lights and destroys"
  ],
  "intense_connection": [
    "we connect on levels that terrify me",
    "intensity is the only way we know",
    "our connection transcends the physical",
    "we are bound by invisible threads",
    "connection this deep changes you forever"
  ],

  // Pride subcategories
  "proud_of_us": [
    "i'm proud of what we built together",
    "pride swells when i think of us",
    "we created something worth being proud of",
    "pride in us outweighs the pain",
    "i'm proud of how we loved"
  ],
  "too_proud_to_beg": [
    "pride won't let me crawl back to you",
    "too proud to beg for your love",
    "pride is my armor and my prison",
    "i won't beg for what should be freely given",
    "pride keeps me standing when love fails"
  ],
  "swallowing_pride": [
    "pride tastes bitter going down",
    "i swallow pride like medicine",
    "sometimes love requires eating pride",
    "pride is a small price for your love",
    "i choke on pride to keep you close"
  ],
  "pride_before_fall": [
    "pride led me to ruin",
    "my pride was our downfall",
    "pride blinded me to what mattered",
    "pride came before our fall",
    "pride built the wall between us"
  ],
  "damaged_pride": [
    "you wounded my pride beyond repair",
    "pride lies broken at your feet",
    "damaged pride cuts deeper than heartbreak",
    "you stripped away my pride and dignity",
    "pride was the first casualty of loving you"
  ],

  // Yearning subcategories
  "yearn_for_touch": [
    "my skin yearns for your hands",
    "i yearn for your touch like desert yearns for rain",
    "yearning for your touch is physical pain",
    "my body remembers and yearns",
    "yearning for touch that will never come"
  ],
  "desperate_need": [
    "need consumes me like hunger",
    "desperation is my constant companion",
    "i need you like i need oxygen",
    "desperate need claws at my chest",
    "need this deep should have a name"
  ],
  "soul_yearning": [
    "my soul yearns for its missing piece",
    "yearning lives in the depths of my being",
    "soul-deep yearning has no cure",
    "you are what my soul yearns for",
    "yearning echoes in the chambers of my soul"
  ],
  "yearning_for_past": [
    "i yearn for the people we used to be",
    "yearning for yesterday consumes today",
    "the past calls to me like a siren",
    "i yearn for the time when love was enough",
    "yearning for what was prevents what could be"
  ],
  "unfulfilled_yearning": [
    "yearning without satisfaction is torture",
    "unfulfilled yearning is my daily bread",
    "wanting what i can't have defines me",
    "yearning unfulfilled becomes a way of life",
    "i am built of unfulfilled desires"
  ]
};
