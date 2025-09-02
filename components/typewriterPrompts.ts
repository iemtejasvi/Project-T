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
    "i hate how you made me love you",
    "i'm furious you left without explanation",
    "i rage at your perfect indifference",
    "i burn with anger you'll never see",
    "i'm angry you took my peace",
    "i hate that you don't care",
    "i'm furious you moved on so fast",
    "i rage at your beautiful cruelty",
    "i'm angry you made me weak",
    "i hate how easily you forgot",
    "i'm furious you broke my trust",
    "i rage at your cold goodbye"
  ],
  "angry_at_myself": [
    "i hate myself for loving you",
    "i'm furious i let you hurt me",
    "i rage at my own stupidity",
    "i hate myself for believing you",
    "i'm angry i stayed too long",
    "i rage at my broken heart",
    "i hate myself for missing you",
    "i'm furious i can't forget you",
    "i rage at my own weakness",
    "i hate myself for trusting you",
    "i'm angry i gave you everything",
    "i rage at my own naivety"
  ],
  "angry_at_situation": [
    "i'm furious this happened to us",
    "i rage at life's cruel timing",
    "i hate how unfair this is",
    "i'm angry fate tore us apart",
    "i rage at the universe's cruelty",
    "i hate how things ended",
    "i'm furious at the circumstances",
    "i rage at life's injustice",
    "i hate how we lost everything",
    "i'm angry at the timing",
    "i rage at what we became",
    "i hate how it all fell apart"
  ],
  "not_angry_anymore": [
    "i'm too tired to be angry",
    "i don't have energy for rage",
    "i'm too broken to feel fury",
    "i don't care enough to hate",
    "i'm too empty to be angry",
    "i don't have strength for anger",
    "i'm too numb to feel rage",
    "i don't have fire left inside",
    "i'm too exhausted to be furious",
    "i don't have anger left",
    "i'm too dead inside to rage",
    "i don't have fury anymore"
  ],

  // Apology subcategories
  "im_sorry": [
    "i'm sorry i wasn't enough for you",
    "i'm sorry i let you down",
    "i'm sorry i couldn't save us",
    "i'm sorry i hurt you so badly",
    "i'm sorry i wasn't who you needed",
    "i'm sorry i failed you completely",
    "i'm sorry i broke your heart",
    "i'm sorry i wasn't strong enough",
    "i'm sorry i made you leave",
    "i'm sorry i couldn't fix this",
    "i'm sorry i destroyed what we had",
    "i'm sorry i wasn't worth staying for"
  ],
  "you_should_be_sorry": [
    "i'm waiting for you to say sorry",
    "i'm tired of your empty apologies",
    "i'm done waiting for your sorry",
    "i'm exhausted by your fake remorse",
    "i'm sick of your meaningless sorry",
    "i'm over your half-hearted apologies",
    "i'm done with your empty words",
    "i'm tired of your fake sorry",
    "i'm exhausted by your lies",
    "i'm sick of your empty promises",
    "i'm over your meaningless apologies",
    "i'm done with your fake remorse"
  ],
  "both_need_apologize": [
    "i'm sorry we both messed up",
    "i'm sorry we hurt each other",
    "i'm sorry we both failed",
    "i'm sorry we destroyed everything",
    "i'm sorry we both gave up",
    "i'm sorry we both ran away",
    "i'm sorry we both broke down",
    "i'm sorry we both lost",
    "i'm sorry we both failed us",
    "i'm sorry we both gave in",
    "i'm sorry we both fell apart",
    "i'm sorry we both destroyed us"
  ],
  "im_not_sorry": [
    "i'm not sorry for leaving you",
    "i'm not sorry for walking away",
    "i'm not sorry for protecting myself",
    "i'm not sorry for choosing me",
    "i'm not sorry for ending this",
    "i'm not sorry for saving myself",
    "i'm not sorry for breaking free",
    "i'm not sorry for moving on",
    "i'm not sorry for letting go",
    "i'm not sorry for choosing peace",
    "i'm not sorry for finding myself",
    "i'm not sorry for being free"
  ],

  // Blame subcategories
  "blame_you": [
    "i blame you for breaking my heart",
    "i blame you for leaving me",
    "i blame you for destroying us",
    "i blame you for making me weak",
    "i blame you for taking everything",
    "i blame you for my pain",
    "i blame you for my tears",
    "i blame you for my loneliness",
    "i blame you for my brokenness",
    "i blame you for my emptiness",
    "i blame you for my suffering",
    "i blame you for my despair"
  ],
  "blame_myself": [
    "i blame myself for loving you",
    "i blame myself for trusting you",
    "i blame myself for staying too long",
    "i blame myself for believing you",
    "i blame myself for my pain",
    "i blame myself for my tears",
    "i blame myself for my brokenness",
    "i blame myself for my weakness",
    "i blame myself for my stupidity",
    "i blame myself for my naivety",
    "i blame myself for my failure",
    "i blame myself for my loss"
  ],
  "both_to_blame": [
    "i blame us both for this mess",
    "i blame us both for our pain",
    "i blame us both for our failure",
    "i blame us both for our destruction",
    "i blame us both for our loss",
    "i blame us both for our tears",
    "i blame us both for our brokenness",
    "i blame us both for our suffering",
    "i blame us both for our despair",
    "i blame us both for our emptiness",
    "i blame us both for our loneliness",
    "i blame us both for our downfall"
  ],
  "no_one_to_blame": [
    "i don't blame anyone for this",
    "i don't blame you or me",
    "i don't blame us for failing",
    "i don't blame anyone for pain",
    "i don't blame anyone for tears",
    "i don't blame anyone for loss",
    "i don't blame anyone for suffering",
    "i don't blame anyone for brokenness",
    "i don't blame anyone for emptiness",
    "i don't blame anyone for loneliness",
    "i don't blame anyone for despair",
    "i don't blame anyone for this mess"
  ],

  // Confession subcategories
  "have_to_tell_you": [
    "i have to tell you i love you",
    "i have to tell you i miss you",
    "i have to tell you i'm broken",
    "i have to tell you i'm sorry",
    "i have to tell you i'm dying",
    "i have to tell you i'm lost",
    "i have to tell you i'm empty",
    "i have to tell you i'm alone",
    "i have to tell you i'm scared",
    "i have to tell you i'm hurting",
    "i have to tell you i'm lost",
    "i have to tell you i'm dying inside"
  ],
  "keep_secret": [
    "i'll keep this secret forever",
    "i'll keep this pain to myself",
    "i'll keep this love hidden",
    "i'll keep this truth buried",
    "i'll keep this hurt inside",
    "i'll keep this memory locked",
    "i'll keep this feeling secret",
    "i'll keep this wound hidden",
    "i'll keep this loss private",
    "i'll keep this grief silent",
    "i'll keep this love secret",
    "i'll keep this pain forever"
  ],
  "i_was_wrong": [
    "i was wrong about everything",
    "i was wrong to trust you",
    "i was wrong to love you",
    "i was wrong to stay",
    "i was wrong to believe",
    "i was wrong to hope",
    "i was wrong to dream",
    "i was wrong to fight",
    "i was wrong to care",
    "i was wrong to try",
    "i was wrong to wait",
    "i was wrong to give up"
  ],
  "you_were_wrong": [
    "you were wrong about me",
    "you were wrong to leave",
    "you were wrong to hurt me",
    "you were wrong to lie",
    "you were wrong to break promises",
    "you were wrong to give up",
    "you were wrong to walk away",
    "you were wrong to forget me",
    "you were wrong to move on",
    "you were wrong to replace me",
    "you were wrong to abandon me",
    "you were wrong to destroy us"
  ],
  "both_made_mistakes": [
    "i know we both made mistakes",
    "i know we both failed",
    "i know we both hurt each other",
    "i know we both gave up",
    "i know we both ran away",
    "i know we both broke down",
    "i know we both lost",
    "i know we both destroyed everything",
    "i know we both fell apart",
    "i know we both gave in",
    "i know we both failed us",
    "i know we both destroyed us"
  ],

  // Fear subcategories
  "afraid_losing_you": [
    "i'm afraid of losing you forever",
    "i'm terrified of life without you",
    "i'm scared you'll forget me",
    "i'm afraid you'll move on",
    "i'm terrified of being alone",
    "i'm scared you'll find someone else",
    "i'm afraid you'll never come back",
    "i'm terrified of losing you completely",
    "i'm scared you'll stop loving me",
    "i'm afraid you'll disappear forever",
    "i'm terrified of losing you again",
    "i'm scared you'll leave me behind"
  ],
  "afraid_commitment": [
    "i'm afraid of committing to you",
    "i'm terrified of being trapped",
    "i'm scared of forever with you",
    "i'm afraid of being tied down",
    "i'm terrified of losing my freedom",
    "i'm scared of making promises",
    "i'm afraid of being responsible",
    "i'm terrified of being vulnerable",
    "i'm scared of being hurt again",
    "i'm afraid of trusting you",
    "i'm terrified of being abandoned",
    "i'm scared of being left alone"
  ],
  "afraid_future": [
    "i'm afraid of what's coming",
    "i'm terrified of tomorrow",
    "i'm scared of the unknown",
    "i'm afraid of what's next",
    "i'm terrified of the future",
    "i'm scared of what's ahead",
    "i'm afraid of what's waiting",
    "i'm terrified of what's coming",
    "i'm scared of what's next",
    "i'm afraid of what's ahead",
    "i'm terrified of what's waiting",
    "i'm scared of what's coming"
  ],
  "not_afraid_anymore": [
    "i'm not afraid of anything anymore",
    "i'm not scared of losing you",
    "i'm not afraid of being alone",
    "i'm not scared of the future",
    "i'm not afraid of pain",
    "i'm not scared of heartbreak",
    "i'm not afraid of being hurt",
    "i'm not scared of being abandoned",
    "i'm not afraid of being vulnerable",
    "i'm not scared of being broken",
    "i'm not afraid of being empty",
    "i'm not scared of being lost"
  ],

  // Forgiveness subcategories
  "asking_forgiveness": [
    "i'm begging for your forgiveness",
    "i need you to forgive me",
    "i'm asking for your mercy",
    "i need your forgiveness to heal",
    "i'm pleading for your forgiveness",
    "i need you to forgive my mistakes",
    "i'm begging for your understanding",
    "i need your forgiveness to move on",
    "i'm asking for your compassion",
    "i need you to forgive my pain",
    "i'm pleading for your mercy",
    "i need your forgiveness to survive"
  ],
  "forgive_you": [
    "i forgive you for hurting me",
    "i forgive you for leaving me",
    "i forgive you for breaking my heart",
    "i forgive you for destroying us",
    "i forgive you for abandoning me",
    "i forgive you for lying to me",
    "i forgive you for giving up",
    "i forgive you for moving on",
    "i forgive you for forgetting me",
    "i forgive you for replacing me",
    "i forgive you for breaking promises",
    "i forgive you for destroying everything"
  ],
  "cant_forgive": [
    "i can't forgive you for this",
    "i can't forgive you for hurting me",
    "i can't forgive you for leaving",
    "i can't forgive you for breaking me",
    "i can't forgive you for destroying us",
    "i can't forgive you for abandoning me",
    "i can't forgive you for lying",
    "i can't forgive you for giving up",
    "i can't forgive you for moving on",
    "i can't forgive you for forgetting me",
    "i can't forgive you for replacing me",
    "i can't forgive you for breaking promises"
  ],
  "forgive_myself": [
    "i forgive myself for loving you",
    "i forgive myself for trusting you",
    "i forgive myself for staying too long",
    "i forgive myself for believing you",
    "i forgive myself for my mistakes",
    "i forgive myself for my weakness",
    "i forgive myself for my stupidity",
    "i forgive myself for my naivety",
    "i forgive myself for my failure",
    "i forgive myself for my loss",
    "i forgive myself for my pain",
    "i forgive myself for my brokenness"
  ],
  "need_forgive_each_other": [
    "i need us to forgive each other",
    "i need us to let go of pain",
    "i need us to forgive our mistakes",
    "i need us to forgive our failures",
    "i need us to forgive our hurt",
    "i need us to forgive our pain",
    "i need us to forgive our brokenness",
    "i need us to forgive our suffering",
    "i need us to forgive our despair",
    "i need us to forgive our emptiness",
    "i need us to forgive our loneliness",
    "i need us to forgive our destruction"
  ],

  // Goodbye subcategories
  "goodbye_forever": [
    "i'm saying goodbye forever",
    "i'm leaving you forever",
    "i'm walking away forever",
    "i'm saying goodbye to us",
    "i'm leaving this behind forever",
    "i'm saying goodbye to love",
    "i'm leaving you behind forever",
    "i'm saying goodbye to pain",
    "i'm leaving this pain forever",
    "i'm saying goodbye to us forever",
    "i'm leaving you and us forever",
    "i'm saying goodbye to everything forever"
  ],
  "see_you_again": [
    "i'll see you again someday",
    "i'll see you in another life",
    "i'll see you when i'm ready",
    "i'll see you when you're ready",
    "i'll see you when we're healed",
    "i'll see you when time is right",
    "i'll see you when we're different",
    "i'll see you when we're better",
    "i'll see you when we're whole",
    "i'll see you when we're free",
    "i'll see you when we're ready",
    "i'll see you when we're healed"
  ],
  "im_leaving": [
    "i'm leaving you behind",
    "i'm leaving this pain behind",
    "i'm leaving us behind",
    "i'm leaving this love behind",
    "i'm leaving this hurt behind",
    "i'm leaving this brokenness behind",
    "i'm leaving this emptiness behind",
    "i'm leaving this loneliness behind",
    "i'm leaving this despair behind",
    "i'm leaving this suffering behind",
    "i'm leaving this destruction behind",
    "i'm leaving this mess behind"
  ],
  "dont_leave": [
    "i'm begging you not to leave",
    "i'm pleading with you to stay",
    "i'm asking you not to go",
    "i'm begging you to stay",
    "i'm pleading with you not to leave",
    "i'm asking you to stay with me",
    "i'm begging you not to abandon me",
    "i'm pleading with you to stay",
    "i'm asking you not to walk away",
    "i'm begging you to stay here",
    "i'm pleading with you not to go",
    "i'm asking you to stay with me"
  ],
  "need_part_ways": [
    "i need us to part ways",
    "i need us to go separate ways",
    "i need us to walk different paths",
    "i need us to let each other go",
    "i need us to move on separately",
    "i need us to find different paths",
    "i need us to go our own ways",
    "i need us to separate for good",
    "i need us to part ways forever",
    "i need us to go separate ways",
    "i need us to walk different paths",
    "i need us to let each other go"
  ],

  // Gratitude subcategories
  "thank_everything": [
    "i'm grateful for everything we had",
    "i'm thankful for all our memories",
    "i'm grateful for the time we shared",
    "i'm thankful for everything you gave me",
    "i'm grateful for our journey together",
    "i'm thankful for all our moments",
    "i'm grateful for everything we built",
    "i'm thankful for all our experiences",
    "i'm grateful for everything we created",
    "i'm thankful for all our stories",
    "i'm grateful for everything we shared",
    "i'm thankful for all our love"
  ],
  "thank_lessons": [
    "i'm grateful for the lessons you taught me",
    "i'm thankful for what you showed me",
    "i'm grateful for the wisdom you gave me",
    "i'm thankful for how you changed me",
    "i'm grateful for what you taught me",
    "i'm thankful for the growth you inspired",
    "i'm grateful for the strength you gave me",
    "i'm thankful for the courage you showed me",
    "i'm grateful for the truth you taught me",
    "i'm thankful for the love you showed me",
    "i'm grateful for the hope you gave me",
    "i'm thankful for the light you showed me"
  ],
  "grateful_us": [
    "i'm grateful for what we had together",
    "i'm thankful for the love we shared",
    "i'm grateful for the connection we felt",
    "i'm thankful for the bond we formed",
    "i'm grateful for the moments we created",
    "i'm thankful for the memories we made",
    "i'm grateful for the time we spent",
    "i'm thankful for the experiences we had",
    "i'm grateful for the stories we wrote",
    "i'm thankful for the dreams we shared",
    "i'm grateful for the future we planned",
    "i'm thankful for the past we built"
  ],
  "grateful_pain": [
    "i'm grateful for the pain you caused me",
    "i'm thankful for the hurt you gave me",
    "i'm grateful for the suffering you brought me",
    "i'm thankful for the wounds you left me",
    "i'm grateful for the tears you made me cry",
    "i'm thankful for the heartbreak you gave me",
    "i'm grateful for the loneliness you left me",
    "i'm thankful for the emptiness you gave me",
    "i'm grateful for the despair you caused me",
    "i'm thankful for the brokenness you left me",
    "i'm grateful for the destruction you brought me",
    "i'm thankful for the loss you gave me"
  ],

  // Guilt subcategories
  "feel_guilty": [
    "i feel guilty for everything",
    "i feel guilty for hurting you",
    "i feel guilty for leaving you",
    "i feel guilty for breaking us",
    "i feel guilty for destroying everything",
    "i feel guilty for abandoning you",
    "i feel guilty for lying to you",
    "i feel guilty for giving up",
    "i feel guilty for moving on",
    "i feel guilty for forgetting you",
    "i feel guilty for replacing you",
    "i feel guilty for breaking promises"
  ],
  "innocent": [
    "i'm innocent of all charges",
    "i'm innocent of hurting you",
    "i'm innocent of breaking us",
    "i'm innocent of destroying everything",
    "i'm innocent of abandoning you",
    "i'm innocent of lying to you",
    "i'm innocent of giving up",
    "i'm innocent of moving on",
    "i'm innocent of forgetting you",
    "i'm innocent of replacing you",
    "i'm innocent of breaking promises",
    "i'm innocent of all this pain"
  ],
  "you_should_guilty": [
    "i think you should feel guilty",
    "i think you should feel ashamed",
    "i think you should feel bad",
    "i think you should feel responsible",
    "i think you should feel remorse",
    "i think you should feel regret",
    "i think you should feel sorry",
    "i think you should feel pain",
    "i think you should feel hurt",
    "i think you should feel broken",
    "i think you should feel empty",
    "i think you should feel lost"
  ],
  "no_one_guilty": [
    "i don't think anyone is guilty",
    "i don't think anyone is to blame",
    "i don't think anyone is responsible",
    "i don't think anyone should feel guilty",
    "i don't think anyone should feel ashamed",
    "i don't think anyone should feel bad",
    "i don't think anyone should feel remorse",
    "i don't think anyone should feel regret",
    "i don't think anyone should feel sorry",
    "i don't think anyone should feel pain",
    "i don't think anyone should feel hurt",
    "i don't think anyone should feel broken"
  ],
  "both_guilty": [
    "i think we're both guilty",
    "i think we're both to blame",
    "i think we're both responsible",
    "i think we both should feel guilty",
    "i think we both should feel ashamed",
    "i think we both should feel bad",
    "i think we both should feel remorse",
    "i think we both should feel regret",
    "i think we both should feel sorry",
    "i think we both should feel pain",
    "i think we both should feel hurt",
    "i think we both should feel broken"
  ],

  // Hate subcategories
  "hate_you": [
    "i hate you for breaking my heart",
    "i hate you for leaving me",
    "i hate you for destroying us",
    "i hate you for making me weak",
    "i hate you for taking everything",
    "i hate you for my pain",
    "i hate you for my tears",
    "i hate you for my loneliness",
    "i hate you for my brokenness",
    "i hate you for my emptiness",
    "i hate you for my suffering",
    "i hate you for my despair"
  ],
  "hate_myself": [
    "i hate myself for loving you",
    "i hate myself for trusting you",
    "i hate myself for staying too long",
    "i hate myself for believing you",
    "i hate myself for my pain",
    "i hate myself for my tears",
    "i hate myself for my brokenness",
    "i hate myself for my weakness",
    "i hate myself for my stupidity",
    "i hate myself for my naivety",
    "i hate myself for my failure",
    "i hate myself for my loss"
  ],
  "hate_what_we_became": [
    "i hate what we became together",
    "i hate the mess we made",
    "i hate the toxic thing we created",
    "i hate what we turned into",
    "i hate the destruction we caused",
    "i hate the pain we created",
    "i hate the hurt we caused",
    "i hate the brokenness we made",
    "i hate the emptiness we created",
    "i hate the loneliness we caused",
    "i hate the despair we made",
    "i hate the suffering we created"
  ],
  "dont_hate_anymore": [
    "i don't hate you anymore",
    "i don't hate myself anymore",
    "i don't hate what we became",
    "i don't hate the pain anymore",
    "i don't hate the hurt anymore",
    "i don't hate the brokenness anymore",
    "i don't hate the emptiness anymore",
    "i don't hate the loneliness anymore",
    "i don't hate the despair anymore",
    "i don't hate the suffering anymore",
    "i don't hate the destruction anymore",
    "i don't hate the mess anymore"
  ],
  "i_cant_hate_you": [
    "i can't hate you even though i try",
    "i can't hate you despite the pain",
    "i can't hate you even when you hurt me",
    "i can't hate you even though you left",
    "i can't hate you even though you broke me",
    "i can't hate you even though you destroyed us",
    "i can't hate you even though you abandoned me",
    "i can't hate you even though you lied",
    "i can't hate you even though you gave up",
    "i can't hate you even though you moved on",
    "i can't hate you even though you forgot me",
    "i can't hate you even though you replaced me"
  ],

  // Heartbreak subcategories
  "you_broke_heart": [
    "i think you broke my heart completely",
    "i think you shattered my heart",
    "i think you destroyed my heart",
    "i think you crushed my heart",
    "i think you tore my heart apart",
    "i think you ripped my heart out",
    "i think you killed my heart",
    "i think you broke my heart forever",
    "i think you destroyed my heart completely",
    "i think you shattered my heart forever",
    "i think you crushed my heart completely",
    "i think you tore my heart apart forever"
  ],
  "broke_own_heart": [
    "i think i broke my own heart",
    "i think i shattered my own heart",
    "i think i destroyed my own heart",
    "i think i crushed my own heart",
    "i think i tore my own heart apart",
    "i think i ripped my own heart out",
    "i think i killed my own heart",
    "i think i broke my own heart forever",
    "i think i destroyed my own heart completely",
    "i think i shattered my own heart forever",
    "i think i crushed my own heart completely",
    "i think i tore my own heart apart forever"
  ],
  "broke_each_other": [
    "i think we broke each other's hearts",
    "i think we shattered each other's hearts",
    "i think we destroyed each other's hearts",
    "i think we crushed each other's hearts",
    "i think we tore each other's hearts apart",
    "i think we ripped each other's hearts out",
    "i think we killed each other's hearts",
    "i think we broke each other's hearts forever",
    "i think we destroyed each other's hearts completely",
    "i think we shattered each other's hearts forever",
    "i think we crushed each other's hearts completely",
    "i think we tore each other's hearts apart forever"
  ],
  "heart_healing": [
    "i think my heart is slowly healing",
    "i think my heart is slowly mending",
    "i think my heart is slowly recovering",
    "i think my heart is slowly getting better",
    "i think my heart is slowly coming back",
    "i think my heart is slowly finding peace",
    "i think my heart is slowly finding hope",
    "i think my heart is slowly finding love",
    "i think my heart is slowly finding joy",
    "i think my heart is slowly finding happiness",
    "i think my heart is slowly finding light",
    "i think my heart is slowly finding itself"
  ],

  // Jealousy subcategories
  "jealous_of_you": [
    "i'm jealous of your happiness",
    "i'm jealous of your freedom",
    "i'm jealous of your new life",
    "i'm jealous of your ability to move on",
    "i'm jealous of your peace",
    "i'm jealous of your strength",
    "i'm jealous of your courage",
    "i'm jealous of your independence",
    "i'm jealous of your healing",
    "i'm jealous of your growth",
    "i'm jealous of your progress",
    "i'm jealous of your success"
  ],
  "jealous_of_others": [
    "i'm jealous of people who have love",
    "i'm jealous of people who have happiness",
    "i'm jealous of people who have peace",
    "i'm jealous of people who have freedom",
    "i'm jealous of people who have strength",
    "i'm jealous of people who have courage",
    "i'm jealous of people who have independence",
    "i'm jealous of people who have healing",
    "i'm jealous of people who have growth",
    "i'm jealous of people who have progress",
    "i'm jealous of people who have success",
    "i'm jealous of people who have everything"
  ],
  "you_jealous_of_me": [
    "i think you're jealous of my happiness",
    "i think you're jealous of my freedom",
    "i think you're jealous of my new life",
    "i think you're jealous of my ability to move on",
    "i think you're jealous of my peace",
    "i think you're jealous of my strength",
    "i think you're jealous of my courage",
    "i think you're jealous of my independence",
    "i think you're jealous of my healing",
    "i think you're jealous of my growth",
    "i think you're jealous of my progress",
    "i think you're jealous of my success"
  ],
  "not_jealous_anymore": [
    "i'm not jealous of anyone anymore",
    "i'm not jealous of your happiness",
    "i'm not jealous of your freedom",
    "i'm not jealous of your new life",
    "i'm not jealous of your ability to move on",
    "i'm not jealous of your peace",
    "i'm not jealous of your strength",
    "i'm not jealous of your courage",
    "i'm not jealous of your independence",
    "i'm not jealous of your healing",
    "i'm not jealous of your growth",
    "i'm not jealous of your progress"
  ],

  // Love subcategories
  "love_you": [
    "i love you more than words can say",
    "i love you with all my heart",
    "i love you more than life itself",
    "i love you beyond measure",
    "i love you with everything i have",
    "i love you more than you know",
    "i love you with all my soul",
    "i love you more than anything",
    "i love you with all my being",
    "i love you more than words",
    "i love you with all my heart",
    "i love you more than everything"
  ],
  "dont_love_anymore": [
    "i don't love you anymore",
    "i don't love you like i used to",
    "i don't love you the same way",
    "i don't love you as much",
    "i don't love you at all",
    "i don't love you anymore",
    "i don't love you like before",
    "i don't love you the same",
    "i don't love you anymore",
    "i don't love you like i did",
    "i don't love you anymore",
    "i don't love you like i used to"
  ],
  "love_cant_be_together": [
    "i love you but we can't be together",
    "i love you but it's not enough",
    "i love you but we're not meant to be",
    "i love you but we're not right",
    "i love you but we're not good",
    "i love you but we're not healthy",
    "i love you but we're not safe",
    "i love you but we're not whole",
    "i love you but we're not complete",
    "i love you but we're not perfect",
    "i love you but we're not right",
    "i love you but we're not meant to be"
  ],
  "still_love": [
    "i still love you despite everything",
    "i still love you even now",
    "i still love you after all this time",
    "i still love you through the pain",
    "i still love you through the hurt",
    "i still love you through the tears",
    "i still love you through the loneliness",
    "i still love you through the brokenness",
    "i still love you through the emptiness",
    "i still love you through the despair",
    "i still love you through the suffering",
    "i still love you through the destruction"
  ],
  "never_loved": [
    "i never loved you at all",
    "i never loved you like you thought",
    "i never loved you the way you wanted",
    "i never loved you the way you needed",
    "i never loved you the way you deserved",
    "i never loved you the way you hoped",
    "i never loved you the way you dreamed",
    "i never loved you the way you wished",
    "i never loved you the way you wanted",
    "i never loved you the way you needed",
    "i never loved you the way you deserved",
    "i never loved you the way you hoped"
  ],

  // Missing subcategories
  "miss_you": [
    "i miss you more than words can say",
    "i miss you with all my heart",
    "i miss you more than life itself",
    "i miss you beyond measure",
    "i miss you with everything i have",
    "i miss you more than you know",
    "i miss you with all my soul",
    "i miss you more than anything",
    "i miss you with all my being",
    "i miss you more than words",
    "i miss you with all my heart",
    "i miss you more than everything"
  ],
  "dont_miss_anymore": [
    "i don't miss you anymore",
    "i don't miss you like i used to",
    "i don't miss you the same way",
    "i don't miss you as much",
    "i don't miss you at all",
    "i don't miss you anymore",
    "i don't miss you like before",
    "i don't miss you the same",
    "i don't miss you anymore",
    "i don't miss you like i did",
    "i don't miss you anymore",
    "i don't miss you like i used to"
  ],
  "miss_who_you_were": [
    "i miss who you used to be",
    "i miss the person you were before",
    "i miss the version of you i loved",
    "i miss the you that loved me",
    "i miss the you that cared about me",
    "i miss the you that wanted me",
    "i miss the you that needed me",
    "i miss the you that chose me",
    "i miss the you that stayed with me",
    "i miss the you that fought for me",
    "i miss the you that believed in me",
    "i miss the you that loved me"
  ],
  "miss_who_we_were": [
    "i miss who we used to be",
    "i miss the couple we were before",
    "i miss the us that loved each other",
    "i miss the us that cared about each other",
    "i miss the us that wanted each other",
    "i miss the us that needed each other",
    "i miss the us that chose each other",
    "i miss the us that stayed together",
    "i miss the us that fought for each other",
    "i miss the us that believed in each other",
    "i miss the us that loved each other",
    "i miss the us that cared about each other"
  ],
  "miss_myself": [
    "i miss who i used to be",
    "i miss the person i was before",
    "i miss the me that loved you",
    "i miss the me that cared about you",
    "i miss the me that wanted you",
    "i miss the me that needed you",
    "i miss the me that chose you",
    "i miss the me that stayed with you",
    "i miss the me that fought for you",
    "i miss the me that believed in you",
    "i miss the me that loved you",
    "i miss the me that cared about you"
  ],

  // Regret subcategories
  "regret_everything": [
    "i regret everything about us",
    "i regret loving you",
    "i regret trusting you",
    "i regret staying with you",
    "i regret believing you",
    "i regret giving you my heart",
    "i regret giving you my soul",
    "i regret giving you my everything",
    "i regret giving you my time",
    "i regret giving you my energy",
    "i regret giving you my love",
    "i regret giving you my life"
  ],
  "no_regrets": [
    "i regret nothing about us",
    "i regret nothing about loving you",
    "i regret nothing about trusting you",
    "i regret nothing about staying with you",
    "i regret nothing about believing you",
    "i regret nothing about giving you my heart",
    "i regret nothing about giving you my soul",
    "i regret nothing about giving you my everything",
    "i regret nothing about giving you my time",
    "i regret nothing about giving you my energy",
    "i regret nothing about giving you my love",
    "i regret nothing about giving you my life"
  ],
  "regret_not_trying": [
    "i regret not trying harder for us",
    "i regret not fighting harder for us",
    "i regret not putting in more effort",
    "i regret not giving it my all",
    "i regret not trying to save us",
    "i regret not trying to fix us",
    "i regret not trying to heal us",
    "i regret not trying to rebuild us",
    "i regret not trying to restore us",
    "i regret not trying to revive us",
    "i regret not trying to renew us",
    "i regret not trying to repair us"
  ],
  "regret_meeting": [
    "i regret meeting you",
    "i regret the day i met you",
    "i regret ever knowing you",
    "i regret ever loving you",
    "i regret ever trusting you",
    "i regret ever believing you",
    "i regret ever giving you my heart",
    "i regret ever giving you my soul",
    "i regret ever giving you my everything",
    "i regret ever giving you my time",
    "i regret ever giving you my energy",
    "i regret ever giving you my love"
  ],
  "both_have_regrets": [
    "i think we both have regrets",
    "i think we both regret everything",
    "i think we both regret loving each other",
    "i think we both regret trusting each other",
    "i think we both regret staying together",
    "i think we both regret believing each other",
    "i think we both regret giving each other our hearts",
    "i think we both regret giving each other our souls",
    "i think we both regret giving each other our everything",
    "i think we both regret giving each other our time",
    "i think we both regret giving each other our energy",
    "i think we both regret giving each other our love"
  ],

  // Sadness subcategories
  "so_sad": [
    "i'm so sad without you",
    "i'm so sad about everything",
    "i'm so sad about us",
    "i'm so sad about what we lost",
    "i'm so sad about what we had",
    "i'm so sad about what we could have been",
    "i'm so sad about what we destroyed",
    "i'm so sad about what we broke",
    "i'm so sad about what we ruined",
    "i'm so sad about what we lost",
    "i'm so sad about what we had",
    "i'm so sad about what we could have been"
  ],
  "finding_happiness": [
    "i'm slowly finding happiness again",
    "i'm slowly finding joy again",
    "i'm slowly finding peace again",
    "i'm slowly finding love again",
    "i'm slowly finding hope again",
    "i'm slowly finding light again",
    "i'm slowly finding myself again",
    "i'm slowly finding strength again",
    "i'm slowly finding courage again",
    "i'm slowly finding independence again",
    "i'm slowly finding healing again",
    "i'm slowly finding growth again"
  ],
  "sad_what_lost": [
    "i'm sad about what we lost",
    "i'm sad about what we had",
    "i'm sad about what we could have been",
    "i'm sad about what we destroyed",
    "i'm sad about what we broke",
    "i'm sad about what we ruined",
    "i'm sad about what we lost",
    "i'm sad about what we had",
    "i'm sad about what we could have been",
    "i'm sad about what we destroyed",
    "i'm sad about what we broke",
    "i'm sad about what we ruined"
  ],
  "sad_for_you": [
    "i'm sad for you and your pain",
    "i'm sad for you and your loss",
    "i'm sad for you and your suffering",
    "i'm sad for you and your brokenness",
    "i'm sad for you and your emptiness",
    "i'm sad for you and your loneliness",
    "i'm sad for you and your despair",
    "i'm sad for you and your destruction",
    "i'm sad for you and your mess",
    "i'm sad for you and your failure",
    "i'm sad for you and your loss",
    "i'm sad for you and your pain"
  ],
  "sad_for_me": [
    "i'm sad for me and my pain",
    "i'm sad for me and my loss",
    "i'm sad for me and my suffering",
    "i'm sad for me and my brokenness",
    "i'm sad for me and my emptiness",
    "i'm sad for me and my loneliness",
    "i'm sad for me and my despair",
    "i'm sad for me and my destruction",
    "i'm sad for me and my mess",
    "i'm sad for me and my failure",
    "i'm sad for me and my loss",
    "i'm sad for me and my pain"
  ],

  // Shame subcategories
  "ashamed": [
    "i'm ashamed of everything i did",
    "i'm ashamed of how i acted",
    "i'm ashamed of what i said",
    "i'm ashamed of what i did",
    "i'm ashamed of who i became",
    "i'm ashamed of how i treated you",
    "i'm ashamed of how i hurt you",
    "i'm ashamed of how i left you",
    "i'm ashamed of how i abandoned you",
    "i'm ashamed of how i lied to you",
    "i'm ashamed of how i gave up",
    "i'm ashamed of how i moved on"
  ],
  "proud_myself": [
    "i'm proud of how far i've come",
    "i'm proud of my strength",
    "i'm proud of my ability to heal",
    "i'm proud of who i've become",
    "i'm proud of my resilience",
    "i'm proud of my courage",
    "i'm proud of my independence",
    "i'm proud of my growth",
    "i'm proud of my progress",
    "i'm proud of my success",
    "i'm proud of my healing",
    "i'm proud of my transformation"
  ],
  "you_should_ashamed": [
    "i think you should be ashamed",
    "i think you should feel ashamed",
    "i think you should be ashamed of yourself",
    "i think you should feel ashamed of what you did",
    "i think you should be ashamed of your behavior",
    "i think you should feel ashamed of your choices",
    "i think you should be ashamed of your actions",
    "i think you should feel ashamed of your words",
    "i think you should be ashamed of your lies",
    "i think you should feel ashamed of your betrayal",
    "i think you should be ashamed of your abandonment",
    "i think you should feel ashamed of your destruction"
  ],
  "both_should_ashamed": [
    "i think we both should be ashamed",
    "i think we both should feel ashamed",
    "i think we both should be ashamed of ourselves",
    "i think we both should feel ashamed of what we did",
    "i think we both should be ashamed of our behavior",
    "i think we both should feel ashamed of our choices",
    "i think we both should be ashamed of our actions",
    "i think we both should feel ashamed of our words",
    "i think we both should be ashamed of our lies",
    "i think we both should feel ashamed of our betrayal",
    "i think we both should be ashamed of our abandonment",
    "i think we both should feel ashamed of our destruction"
  ],
  "no_one_ashamed": [
    "i don't think anyone should be ashamed",
    "i don't think anyone should feel ashamed",
    "i don't think anyone should be ashamed of themselves",
    "i don't think anyone should feel ashamed of what they did",
    "i don't think anyone should be ashamed of their behavior",
    "i don't think anyone should feel ashamed of their choices",
    "i don't think anyone should be ashamed of their actions",
    "i don't think anyone should feel ashamed of their words",
    "i don't think anyone should be ashamed of their lies",
    "i don't think anyone should feel ashamed of their betrayal",
    "i don't think anyone should be ashamed of their abandonment",
    "i don't think anyone should feel ashamed of their destruction"
  ],

  // Thank You subcategories
  "thank_you": [
    "i want to thank you for everything",
    "i want to thank you for the memories",
    "i want to thank you for the love",
    "i want to thank you for the lessons",
    "i want to thank you for the growth",
    "i want to thank you for the strength",
    "i want to thank you for the courage",
    "i want to thank you for the independence",
    "i want to thank you for the healing",
    "i want to thank you for the transformation",
    "i want to thank you for the progress",
    "i want to thank you for the success"
  ],
  "no_thanks_needed": [
    "i don't need you to thank me",
    "i don't need your thanks",
    "i don't need your gratitude",
    "i don't need your appreciation",
    "i don't need your recognition",
    "i don't need your acknowledgment",
    "i don't need your praise",
    "i don't need your approval",
    "i don't need your validation",
    "i don't need your acceptance",
    "i don't need your love",
    "i don't need your care"
  ],
  "thank_pain": [
    "i want to thank you for the pain",
    "i want to thank you for the hurt",
    "i want to thank you for the suffering",
    "i want to thank you for the wounds",
    "i want to thank you for the tears",
    "i want to thank you for the heartbreak",
    "i want to thank you for the loneliness",
    "i want to thank you for the emptiness",
    "i want to thank you for the despair",
    "i want to thank you for the brokenness",
    "i want to thank you for the destruction",
    "i want to thank you for the loss"
  ],
  "thank_memories": [
    "i want to thank you for the memories",
    "i want to thank you for the moments",
    "i want to thank you for the experiences",
    "i want to thank you for the stories",
    "i want to thank you for the dreams",
    "i want to thank you for the hopes",
    "i want to thank you for the plans",
    "i want to thank you for the future",
    "i want to thank you for the past",
    "i want to thank you for the present",
    "i want to thank you for the love",
    "i want to thank you for the care"
  ],
  "thank_leaving": [
    "i want to thank you for leaving",
    "i want to thank you for walking away",
    "i want to thank you for setting me free",
    "i want to thank you for ending this",
    "i want to thank you for choosing to go",
    "i want to thank you for abandoning me",
    "i want to thank you for giving up",
    "i want to thank you for moving on",
    "i want to thank you for forgetting me",
    "i want to thank you for replacing me",
    "i want to thank you for breaking promises",
    "i want to thank you for destroying everything"
  ],

  // Closure subcategories
  "need_answers": [
    "i need answers to understand what happened",
    "i need answers to know why you left",
    "i need answers to understand where we went wrong",
    "i need answers to move on",
    "i need answers to heal",
    "i need answers to find peace",
    "i need answers to let go",
    "i need answers to end this chapter",
    "i need answers to close this book",
    "i need answers to finish this story",
    "i need answers to complete this journey",
    "i need answers to end this pain"
  ],
  "dont_need_answers": [
    "i don't need answers anymore",
    "i don't need to know why",
    "i don't need explanations",
    "i don't need to understand",
    "i don't need to know what happened",
    "i don't need to know where we went wrong",
    "i don't need to know why you left",
    "i don't need to know the truth",
    "i don't need to know the reasons",
    "i don't need to know the causes",
    "i don't need to know the motives",
    "i don't need to know the intentions"
  ],
  "need_understand": [
    "i need to understand what happened",
    "i need to understand why you left",
    "i need to understand where we went wrong",
    "i need to understand to move on",
    "i need to understand to heal",
    "i need to understand to find peace",
    "i need to understand to let go",
    "i need to understand to end this chapter",
    "i need to understand to close this book",
    "i need to understand to finish this story",
    "i need to understand to complete this journey",
    "i need to understand to end this pain"
  ],
  "need_move_on": [
    "i need to move on from this",
    "i need to move on to better things",
    "i need to move on for my own sake",
    "i need to move on to find peace",
    "i need to move on to find happiness",
    "i need to move on to find love",
    "i need to move on to find hope",
    "i need to move on to find light",
    "i need to move on to find myself",
    "i need to move on to find strength",
    "i need to move on to find courage",
    "i need to move on to find independence"
  ],
  "need_closure": [
    "i need closure to move forward",
    "i need closure to heal properly",
    "i need closure to find peace",
    "i need closure to let go",
    "i need closure to end this chapter",
    "i need closure to close this book",
    "i need closure to finish this story",
    "i need closure to complete this journey",
    "i need closure to end this pain",
    "i need closure to end this suffering",
    "i need closure to end this brokenness",
    "i need closure to end this emptiness"
  ],
  "never_got_closure": [
    "i never got closure from you",
    "i never got the closure i needed",
    "i never got the closure i deserved",
    "i never got the closure i wanted",
    "i never got the closure i hoped for",
    "i never got the closure i dreamed of",
    "i never got the closure i wished for",
    "i never got the closure i prayed for",
    "i never got the closure i begged for",
    "i never got the closure i pleaded for",
    "i never got the closure i cried for",
    "i never got the closure i died for"
  ],
  "seeking_closure": [
    "i'm seeking closure everywhere i can",
    "i'm seeking closure in any way possible",
    "i'm seeking closure desperately",
    "i'm seeking closure frantically",
    "i'm seeking closure hopelessly",
    "i'm seeking closure endlessly",
    "i'm seeking closure tirelessly",
    "i'm seeking closure relentlessly",
    "i'm seeking closure obsessively",
    "i'm seeking closure compulsively",
    "i'm seeking closure desperately",
    "i'm seeking closure frantically"
  ],
  "closure_impossible": [
    "i think closure is impossible for me",
    "i think closure is impossible to achieve",
    "i think closure is impossible to find",
    "i think closure is impossible to get",
    "i think closure is impossible to obtain",
    "i think closure is impossible to reach",
    "i think closure is impossible to grasp",
    "i think closure is impossible to hold",
    "i think closure is impossible to keep",
    "i think closure is impossible to maintain",
    "i think closure is impossible to sustain",
    "i think closure is impossible to preserve"
  ],
  "found_own_closure": [
    "i found my own closure without you",
    "i found my own closure within myself",
    "i found my own closure on my own terms",
    "i found my own closure in my own way",
    "i found my own closure in my own time",
    "i found my own closure in my own space",
    "i found my own closure in my own heart",
    "i found my own closure in my own soul",
    "i found my own closure in my own mind",
    "i found my own closure in my own spirit",
    "i found my own closure in my own being",
    "i found my own closure in my own truth"
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
