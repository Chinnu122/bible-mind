# Script to add even more specialized Hebrew words - Batch 3
with open('hebrew_word_dict.py', 'r', encoding='utf-8') as f:
    content = f.read()

count = content.count("': (")
print(f'Current word count: {count}')

new_words = '''
    # ============================================================
    # MORE HITPAEL (REFLEXIVE) FORMS
    # ============================================================
    'וַיִּתְהַלֵּךְ': ('H1980', 'vayyithalekh', 'and he walked about', 'నడచుకొనెను'),
    'וַיִּתְפַּלֵּל': ('H6419', 'vayyitpallel', 'and he prayed', 'ప్రార్థించెను'),
    'וַיִּשְׁתַּחוּ': ('H7812', 'vayyishtachu', 'and he bowed', 'నమస్కరించెను'),
    'וַיִּתְאַבֵּל': ('H56', 'vayyitabbel', 'and he mourned', 'దుఃఖించెను'),
    'וַיִּתְנַכֵּר': ('H5234', 'vayyitnakker', 'and he disguised', 'మారువేషము వేసుకొనెను'),
    'וַיִּתְחַזֵּק': ('H2388', 'vayyitchazzeq', 'and strengthened himself', 'బలపరచుకొనెను'),
    'הִתְהַלֵּךְ': ('H1980', 'hithalekh', 'walk about', 'నడచుకొను'),
    'הִשְׁתַּחֲוָה': ('H7812', 'hishtachavah', 'bow down', 'నమస్కరించు'),
    'הִתְפַּלֵּל': ('H6419', 'hitpallel', 'pray', 'ప్రార్థించు'),
    'הִתְקַדֵּשׁ': ('H6942', 'hitqaddesh', 'sanctify oneself', 'పరిశుద్ధపరచుకొను'),

    # ============================================================
    # DUAL NUMBER FORMS
    # ============================================================
    'יָמִים': ('H3117', 'yamim', 'days', 'దినములు'),
    'שָׁנִים': ('H8141', 'shanim', 'years', 'సంవత్సరములు'),
    'אַלְפַּיִם': ('H505', 'alpayim', 'two thousand', 'రెండువేలు'),
    'מָאתַיִם': ('H3967', 'matayim', 'two hundred', 'రెండువందలు'),
    'שְׁנָתַיִם': ('H8141', 'shenatayim', 'two years', 'రెండుసంవత్సరములు'),
    'יוֹמַיִם': ('H3117', 'yomayim', 'two days', 'రెండుదినములు'),
    'חֹדְשַׁיִם': ('H2320', 'chodeshayim', 'two months', 'రెండునెలలు'),
    'פַּעֲמַיִם': ('H6471', 'paamayim', 'twice', 'రెండుసార్లు'),
    'שִׁבְעָתַיִם': ('H7659', 'shivatayim', 'sevenfold', 'ఏడురెట్లు'),

    # ============================================================
    # COMMON PHRASE COMPONENTS
    # ============================================================
    'וַיְהִי': ('H1961', 'vayehi', 'and it was', 'అయెను'),
    'יְהִי': ('H1961', 'yehi', 'let there be', 'అగుగాక'),
    'הֲיֵשׁ': ('H3426', 'hayesh', 'is there?', 'ఉన్నదా?'),
    'יֵשׁ': ('H3426', 'yesh', 'there is', 'ఉన్నది'),
    'אֵין': ('H369', 'ayin', 'there is not', 'లేదు'),
    'אֵינֶנּוּ': ('H369', 'einennu', 'he is not', 'అతడు లేడు'),
    'אֵינֶנָּה': ('H369', 'einennah', 'she is not', 'ఆమె లేదు'),
    'אֵינָם': ('H369', 'einam', 'they are not', 'వారు లేరు'),
    'בָּעֲבוּר': ('H5668', 'baavur', 'for the sake of', 'కొరకు'),
    'לְמַעַן': ('H4616', 'lemaan', 'in order that', 'కొరకు'),
    'בִּגְלַל': ('H1558', 'biglal', 'because of', 'వల్ల'),
    'כִּי־אִם': ('H3588', 'ki-im', 'but, except', 'కానీ'),
    'עַד־אֲשֶׁר': ('H5704', 'ad-asher', 'until', 'వరకు'),
    'בְּטֶרֶם': ('H2962', 'beterem', 'before', 'ముందు'),
    'אַחַר': ('H310', 'achar', 'after', 'తరువాత'),
    'כְּמוֹ': ('H3644', 'kemo', 'like, as', 'వలె'),
    'מֵאֵת': ('H854', 'meet', 'from', 'నుండి'),
    'לְפָנַי': ('H6440', 'lefanay', 'before me', 'నా ముందు'),
    'לְפָנֶיךָ': ('H6440', 'lefanekha', 'before you', 'నీ ముందు'),
    'אַחֲרָי': ('H310', 'acharay', 'after me', 'నా తరువాత'),
    'אַחֲרֶיךָ': ('H310', 'acharekha', 'after you', 'నీ తరువాత'),

    # ============================================================
    # MORE GENESIS PLACE NAMES
    # ============================================================
    'בֵּאֵר לַחַי רֹאִי': ('H883', 'Beer Lachai Roi', 'Beer-lahai-roi', 'బెయెర్ లహయ్ రోయి'),
    'קִרְיַת אַרְבַּע': ('H7153', 'Qiryat Arba', 'Kirjath-arba', 'కిర్యత్ అర్బా'),
    'נֶגֶב': ('H5045', 'Negev', 'Negev, south', 'నెగెబు'),
    'פָּארָן': ('H6290', 'Paran', 'Paran', 'పారాను'),
    'שׁוּר': ('H7793', 'Shur', 'Shur', 'షూరు'),
    'קָדֵשׁ': ('H6946', 'Qadesh', 'Kadesh', 'కాదేషు'),
    'אֵילִם': ('H362', 'Elim', 'Elim', 'ఏలీము'),
    'אֹתִיר': ('H6067', 'Otir', 'Ophir', 'ఓఫీరు'),
    'בֵּית לֶחֶם': ('H1035', 'Beit Lechem', 'Bethlehem', 'బేత్‌లెహేము'),
    'רָמָה': ('H7414', 'Ramah', 'Ramah', 'రామా'),
    'צֹעַר': ('H6820', 'Tsoar', 'Zoar', 'సోయరు'),
    'עֲרָד': ('H6166', 'Arad', 'Arad', 'అరాదు'),
    'חַצֵּרֹן': ('H2696', 'Chatsron', 'Hezron', 'హెస్రోను'),

    # ============================================================
    # MORE VERB VARIATIONS
    # ============================================================
    'וַיֹּאמֶר': ('H559', 'vayyomer', 'and he said', 'అతడు చెప్పెను'),
    'וַתֹּאמֶר': ('H559', 'vattomer', 'and she said', 'ఆమె చెప్పెను'),
    'וַיֹּאמְרוּ': ('H559', 'vayyomru', 'and they said', 'వారు చెప్పిరి'),
    'וַתֹּאמַרְנָה': ('H559', 'vattomarnah', 'and they (f) said', 'వారు చెప్పిరి'),
    'וַיָּבֹא': ('H935', 'vayyavo', 'and he came', 'అతడు వచ్చెను'),
    'וַתָּבֹא': ('H935', 'vattavo', 'and she came', 'ఆమె వచ్చెను'),
    'וַיָּבֹאוּ': ('H935', 'vayyavou', 'and they came', 'వారు వచ్చిరి'),
    'וַיֵּלֶךְ': ('H1980', 'vayyelek', 'and he went', 'అతడు వెళ్ళెను'),
    'וַתֵּלֶךְ': ('H1980', 'vattelek', 'and she went', 'ఆమె వెళ్ళెను'),
    'וַיֵּלְכוּ': ('H1980', 'vayyelechu', 'and they went', 'వారు వెళ్ళిరి'),
    'וַיֵּצֵא': ('H3318', 'vayyetse', 'and he went out', 'అతడు వెళ్ళెను'),
    'וַתֵּצֵא': ('H3318', 'vattetse', 'and she went out', 'ఆమె వెళ్ళెను'),
    'וַיֵּצְאוּ': ('H3318', 'vayyetseu', 'and they went out', 'వారు వెళ్ళిరి'),
    'וַיִּקַּח': ('H3947', 'vayyiqqach', 'and he took', 'అతడు తీసుకొనెను'),
    'וַתִּקַּח': ('H3947', 'vattiqqach', 'and she took', 'ఆమె తీసుకొనెను'),
    'וַיִּקְחוּ': ('H3947', 'vayyiqchu', 'and they took', 'వారు తీసుకొనిరి'),
    'וַיִּתֵּן': ('H5414', 'vayyitten', 'and he gave', 'అతడు ఇచ్చెను'),
    'וַתִּתֵּן': ('H5414', 'vattitten', 'and she gave', 'ఆమె ఇచ్చెను'),
    'וַיִּתְּנוּ': ('H5414', 'vayyittenu', 'and they gave', 'వారు ఇచ్చిరి'),
    'וַיַּעַשׂ': ('H6213', 'vayyaas', 'and he made', 'అతడు చేసెను'),
    'וַתַּעַשׂ': ('H6213', 'vattaas', 'and she made', 'ఆమె చేసెను'),
    'וַיַּעֲשׂוּ': ('H6213', 'vayyaasu', 'and they made', 'వారు చేసిరి'),
    'וַיַּרְא': ('H7200', 'vayyar', 'and he saw', 'అతడు చూచెను'),
    'וַתֵּרֶא': ('H7200', 'vattere', 'and she saw', 'ఆమె చూచెను'),
    'וַיִּרְאוּ': ('H7200', 'vayyiru', 'and they saw', 'వారు చూచిరి'),

    # ============================================================
    # BODY PARTS AND ANATOMY
    # ============================================================
    'גָּב': ('H1354', 'gav', 'back', 'వీపు'),
    'בֶּטֶן': ('H990', 'beten', 'belly, womb', 'కడుపు'),
    'חֵיק': ('H2436', 'cheiq', 'bosom', 'రొమ్ము'),
    'יָרֵךְ': ('H3409', 'yarekh', 'thigh', 'తొడ'),
    'כָּתֵף': ('H3802', 'katef', 'shoulder', 'భుజము'),
    'זְרוֹעַ': ('H2220', 'zeroa', 'arm', 'చేయి'),
    'אֶצְבַּע': ('H676', 'etsba', 'finger', 'వేలు'),
    'צֵלָע': ('H6763', 'tsela', 'rib, side', 'ప్రక్క'),
    'שִׁנַּיִם': ('H8127', 'shinnayim', 'teeth', 'పళ్ళు'),
    'שׂעָר': ('H8181', 'sear', 'hair', 'వెంట్రుకలు'),
    'זָקָן': ('H2206', 'zaqan', 'beard', 'గడ్డము'),
    'מֵעַיִם': ('H4578', 'meayim', 'intestines', 'పేగులు'),
    'כְּלָיוֹת': ('H3629', 'kelayot', 'kidneys', 'మూత్రపిండములు'),
    'כָּבֵד': ('H3516', 'kaved', 'liver', 'కాలేయము'),
    'עֶצֶם': ('H6106', 'etsem', 'bone', 'ఎముక'),
    'עֲצָמוֹת': ('H6106', 'atsamot', 'bones', 'ఎముకలు'),

    # ============================================================
    # ANIMALS IN GENESIS
    # ============================================================
    'אַרְיֵה': ('H738', 'aryeh', 'lion', 'సింహము'),
    'זְאֵב': ('H2061', 'zeev', 'wolf', 'తోడేలు'),
    'דֹּב': ('H1677', 'dov', 'bear', 'ఎలుగుబంటి'),
    'נָמֵר': ('H5246', 'namer', 'leopard', 'చిరుతపులి'),
    'נָחָשׁ': ('H5175', 'nachash', 'serpent', 'సర్పము'),
    'עַקְרָב': ('H6137', 'aqrav', 'scorpion', 'తేలు'),
    'נֶשֶׁר': ('H5404', 'nesher', 'eagle', 'పక్షిరాజు'),
    'יוֹנָה': ('H3123', 'yonah', 'dove', 'పావురము'),
    'עֹרֵב': ('H6158', 'orev', 'raven', 'కాకము'),
    'תּוֹר': ('H8449', 'tor', 'turtledove', 'తెల్లగువ్వ'),
    'עַיִט': ('H5861', 'ayit', 'bird of prey', 'మాంసాహారపక్షి'),
    'צְפַרְדֵּעַ': ('H6854', 'tsefardea', 'frog', 'కప్ప'),
    'כִּנָּם': ('H3654', 'kinnam', 'gnats, lice', 'పేను'),
    'עָרֹב': ('H6157', 'arov', 'flies', 'ఈగలు'),
    'אַרְבֶּה': ('H697', 'arbeh', 'locust', 'మిడత'),
    'תֹּלַעַת': ('H8438', 'tolaat', 'worm', 'పురుగు'),
    'דְּבוֹרָה': ('H1682', 'devorah', 'bee', 'తేనెటీగ'),
    'זְבוּב': ('H2070', 'zevuv', 'fly', 'ఈగ'),

    # ============================================================
    # MATERIALS AND SUBSTANCES
    # ============================================================
    'נְחֹשֶׁת': ('H5178', 'nechoshet', 'bronze, copper', 'ఇత్తడి'),
    'בַּרְזֶל': ('H1270', 'barzel', 'iron', 'ఇనుము'),
    'עֹפֶרֶת': ('H5777', 'oferet', 'lead', 'సీసము'),
    'בְּדִיל': ('H913', 'bedil', 'tin', 'తగరము'),
    'אֶדֶן': ('H134', 'eden', 'socket, base', 'అడుగు'),
    'שַׁיִשׁ': ('H7893', 'shayish', 'marble', 'పాలరాయి'),
    'סַפִּיר': ('H5601', 'sappir', 'sapphire', 'నీలము'),
    'שֹׁהַם': ('H7718', 'shoham', 'onyx', 'గోమేధికము'),
    'יַהֲלֹם': ('H3095', 'yahalom', 'diamond', 'వజ్రము'),
    'פִּטְדָה': ('H6357', 'pitdah', 'topaz', 'పుష్యరాగము'),
    'בֶּרֶקֶת': ('H1304', 'bareqet', 'emerald', 'మరకతము'),
    'לֶשֶׁם': ('H3958', 'leshem', 'jacinth', 'పద్మరాగము'),
    'שְׁמֶן': ('H8081', 'shemen', 'oil', 'నూనె'),
    'חֵלֶב': ('H2459', 'chelev', 'fat', 'కొవ్వు'),
    'דְּבַשׁ': ('H1706', 'devash', 'honey', 'తేనె'),
    'חָלָב': ('H2461', 'chalav', 'milk', 'పాలు'),
    'חֹמֶר': ('H2563', 'chomer', 'clay', 'బంకమట్టి'),
    'לְבֵנָה': ('H3843', 'levenah', 'brick', 'ఇటుక'),
    'חֵמָר': ('H2564', 'chemar', 'pitch, tar', 'తారు'),
    'זֶפֶת': ('H2203', 'zefet', 'pitch', 'తారు'),
    'גָּפְרִית': ('H1614', 'gofrit', 'brimstone', 'గంధకము'),
    'מֶלַח': ('H4417', 'melach', 'salt', 'ఉప్పు'),
'''

content = content.rstrip()
if content.endswith('}'):
    content = content[:-1] + new_words + '}'

with open('hebrew_word_dict.py', 'w', encoding='utf-8') as f:
    f.write(content)

new_count = content.count("': (")
print(f'New word count: {new_count}')
print(f'Added {new_count - count} more specialized words!')
