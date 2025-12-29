# Script to add even more specialized Hebrew words - Batch 5
with open('hebrew_word_dict.py', 'r', encoding='utf-8') as f:
    content = f.read()

count = content.count("': (")
print(f'Current word count: {count}')

new_words = '''
    # ============================================================
    # GENESIS 36 NAMES (EDOMITE GENEALOGY - LOW COVERAGE)
    # ============================================================
    'עֲדָה': ('H5711', 'Adah', 'Adah', 'అదా'),
    'אָהֳלִיבָמָה': ('H173', 'Oholivamah', 'Oholibamah', 'ఒహలీబామా'),
    'בָּשְׂמַת': ('H1315', 'Basemat', 'Basemath', 'బాసెమతు'),
    'אֱלִיפָז': ('H464', 'Elifaz', 'Eliphaz', 'ఎలీఫాజు'),
    'רְעוּאֵל': ('H7467', 'Reuel', 'Reuel', 'రెయూయేలు'),
    'יְעוּשׁ': ('H3274', 'Yeush', 'Jeush', 'యెయూషు'),
    'יַעְלָם': ('H3281', 'Yaelam', 'Jaalam', 'యాలాము'),
    'קֹרַח': ('H7141', 'Qorach', 'Korah', 'కోరహు'),
    'תֵּימָן': ('H8487', 'Teiman', 'Teman', 'తేమాను'),
    'אוֹמָר': ('H201', 'Omar', 'Omar', 'ఓమరు'),
    'צְפוֹ': ('H6825', 'Tsefo', 'Zepho', 'సెఫో'),
    'גַּעְתָּם': ('H1609', 'Gaetam', 'Gatam', 'గాతాము'),
    'קְנַז': ('H7073', 'Qenaz', 'Kenaz', 'కెనజు'),
    'עֲמָלֵק': ('H6002', 'Amaleq', 'Amalek', 'అమాలేకు'),
    'תִּמְנָע': ('H8555', 'Timnah', 'Timna', 'తిమ్నా'),
    'נַחַת': ('H5184', 'Nachat', 'Nahath', 'నహతు'),
    'זֶרַח': ('H2226', 'Zerach', 'Zerah', 'జెరహు'),
    'שַׁמָּה': ('H8048', 'Shammah', 'Shammah', 'షమ్మా'),
    'מִזָּה': ('H4199', 'Mizzah', 'Mizzah', 'మిజ్జా'),
    'לוֹטָן': ('H3877', 'Lotan', 'Lotan', 'లోతాను'),
    'שׁוֹבָל': ('H7732', 'Shoval', 'Shobal', 'షోబాలు'),
    'צִבְעוֹן': ('H6649', 'Tsivon', 'Zibeon', 'సిబ్యోను'),
    'עֲנָה': ('H6034', 'Anah', 'Anah', 'అనా'),
    'דִּישׁוֹן': ('H1789', 'Dishon', 'Dishon', 'దీషోను'),
    'אֵצֶר': ('H687', 'Etser', 'Ezer', 'ఏసెరు'),
    'דִּישָׁן': ('H1789', 'Dishan', 'Dishan', 'దీషాను'),
    'הוֹרִי': ('H2753', 'Hori', 'Hori', 'హోరీ'),
    'הֵימָם': ('H1967', 'Hemam', 'Hemam', 'హేమాము'),
    'עֲלְוָן': ('H5935', 'Alvan', 'Alvan', 'అల్వాను'),
    'מָנַחַת': ('H4506', 'Manachat', 'Manahath', 'మనహతు'),
    'עֵיבָל': ('H5858', 'Eival', 'Ebal', 'ఏబాలు'),
    'שְׁפוֹ': ('H8195', 'Shefo', 'Shepho', 'షెఫో'),
    'אוֹנָם': ('H208', 'Onam', 'Onam', 'ఓనాము'),
    'אַיָּה': ('H345', 'Ayyah', 'Ajah', 'అయ్యా'),
    'בֶּלַע': ('H1106', 'Bela', 'Bela', 'బెలా'),
    'יוֹבָב': ('H3103', 'Yovav', 'Jobab', 'యోబాబు'),
    'חֻשָׁם': ('H2367', 'Chusham', 'Husham', 'హుషాము'),
    'הֲדַד': ('H1908', 'Hadad', 'Hadad', 'హదదు'),
    'שַׂמְלָה': ('H8072', 'Samlah', 'Samlah', 'శమ్లా'),
    'שָׁאוּל': ('H7586', 'Shaul', 'Shaul', 'షావూలు'),
    'בַּעַל חָנָן': ('H1177', 'Baal Chanan', 'Baal-hanan', 'బాల్-హానాను'),
    'הֲדַר': ('H1924', 'Hadar', 'Hadar', 'హదరు'),
    'מְהֵיטַבְאֵל': ('H4105', 'Meheitavel', 'Mehetabel', 'మెహేటబేలు'),

    # ============================================================
    # GENESIS 10-11 NAMES (TABLE OF NATIONS)
    # ============================================================
    'גֹּמֶר': ('H1586', 'Gomer', 'Gomer', 'గోమెరు'),
    'מָגוֹג': ('H4031', 'Magog', 'Magog', 'మాగోగు'),
    'מָדַי': ('H4074', 'Maday', 'Madai', 'మాదాయి'),
    'יָוָן': ('H3120', 'Yavan', 'Javan', 'యావాను'),
    'תֻּבָל': ('H8422', 'Tuval', 'Tubal', 'తూబాలు'),
    'מֶשֶׁךְ': ('H4902', 'Meshekh', 'Meshech', 'మెషెకు'),
    'תִּירָס': ('H8494', 'Tiras', 'Tiras', 'తీరాసు'),
    'אַשְׁכְּנַז': ('H813', 'Ashkenaz', 'Ashkenaz', 'అష్కెనజు'),
    'רִיפַת': ('H7384', 'Rifat', 'Riphath', 'రీపతు'),
    'תֹּגַרְמָה': ('H8425', 'Togarmah', 'Togarmah', 'తోగర్మా'),
    'אֱלִישָׁה': ('H473', 'Elishah', 'Elishah', 'ఎలీషా'),
    'תַּרְשִׁישׁ': ('H8659', 'Tarshish', 'Tarshish', 'తర్షీషు'),
    'כִּתִּים': ('H3794', 'Kittim', 'Kittim', 'కిత్తీము'),
    'דֹּדָנִים': ('H1721', 'Dodanim', 'Dodanim', 'దొదానీము'),
    'סְבָא': ('H5434', 'Seva', 'Seba', 'సెబా'),
    'חֲוִילָה': ('H2341', 'Chavilah', 'Havilah', 'హవీలా'),
    'סַבְתָּא': ('H5454', 'Savta', 'Sabtah', 'సబ్తా'),
    'רַעְמָא': ('H7484', 'Raemah', 'Raamah', 'రామా'),
    'סַבְתְּכָא': ('H5455', 'Savtekha', 'Sabtechah', 'సబ్తెకా'),
    'שְׁבָא': ('H7614', 'Sheva', 'Sheba', 'షెబా'),
    'דְּדָן': ('H1719', 'Dedan', 'Dedan', 'దెదాను'),
    'לוּדִים': ('H3866', 'Ludim', 'Ludim', 'లూదీము'),
    'עֲנָמִים': ('H6047', 'Anamim', 'Anamim', 'అనామీము'),
    'לְהָבִים': ('H3853', 'Lehavim', 'Lehabim', 'లెహాబీము'),
    'נַפְתֻּחִים': ('H5320', 'Naftuchim', 'Naphtuhim', 'నఫ్తుహీము'),
    'פַּתְרֻסִים': ('H6625', 'Patrusim', 'Pathrusim', 'పత్రుసీము'),
    'כַּסְלֻחִים': ('H3695', 'Kasluchim', 'Casluhim', 'కస్లూహీము'),
    'כַּפְתֹּרִים': ('H3732', 'Kaftorim', 'Caphtorim', 'కఫ్తొరీము'),
    'צִידוֹן': ('H6721', 'Tsidon', 'Sidon', 'సీదోను'),
    'חֵת': ('H2845', 'Chet', 'Heth', 'హేతు'),
    'יְבוּסִי': ('H2983', 'Yevusi', 'Jebusite', 'యెబూసీ'),
    'גִּרְגָּשִׁי': ('H1622', 'Girgashi', 'Girgashite', 'గిర్గాషీ'),
    'חִוִּי': ('H2340', 'Chivvi', 'Hivite', 'హివ్వీ'),
    'עַרְקִי': ('H6208', 'Arqi', 'Arkite', 'అర్కీ'),
    'סִּינִי': ('H5513', 'Sini', 'Sinite', 'సీనీ'),
    'אַרְוָדִי': ('H721', 'Arvadi', 'Arvadite', 'అర్వాదీ'),
    'צְמָרִי': ('H6786', 'Tsemari', 'Zemarite', 'సెమారీ'),
    'חֲמָתִי': ('H2577', 'Chamati', 'Hamathite', 'హమాతీ'),
    'אֵלָם': ('H5867', 'Elam', 'Elam', 'ఏలాము'),
    'אַשּׁוּר': ('H804', 'Ashshur', 'Asshur', 'అష్షూరు'),
    'אַרְפַּכְשַׁד': ('H775', 'Arpakhshad', 'Arphaxad', 'అర్పక్షదు'),
    'לוּד': ('H3865', 'Lud', 'Lud', 'లూదు'),
    'עֵבֶר': ('H5677', 'Ever', 'Eber', 'ఏబెరు'),
    'פֶּלֶג': ('H6389', 'Peleg', 'Peleg', 'పెలెగు'),
    'יָקְטָן': ('H3355', 'Yoqtan', 'Joktan', 'యొక్తాను'),
    'אַלְמוֹדָד': ('H486', 'Almodad', 'Almodad', 'అల్మోదాదు'),
    'שֶׁלֶף': ('H8026', 'Shelef', 'Sheleph', 'షెలెపు'),
    'חֲצַרְמָוֶת': ('H2700', 'Chatsarmavet', 'Hazarmaveth', 'హసర్మావేతు'),
    'יֶרַח': ('H3392', 'Yerach', 'Jerah', 'యెరహు'),
    'הֲדוֹרָם': ('H1913', 'Hadoram', 'Hadoram', 'హదొరాము'),
    'אוּזָל': ('H187', 'Uzal', 'Uzal', 'ఊజాలు'),
    'דִּקְלָה': ('H1853', 'Diqlah', 'Diklah', 'దిక్లా'),
    'עוֹבָל': ('H5745', 'Oval', 'Obal', 'ఓబాలు'),
    'אֲבִימָאֵל': ('H39', 'Avimael', 'Abimael', 'అబీమాయేలు'),
    'אוֹפִיר': ('H211', 'Ofir', 'Ophir', 'ఓఫీరు'),
    'יוֹבָב': ('H3103', 'Yovav', 'Jobab', 'యోబాబు'),
    'רְעוּ': ('H7466', 'Reu', 'Reu', 'రెయూ'),
    'שְׂרוּג': ('H8286', 'Serug', 'Serug', 'శెరూగు'),

    # ============================================================
    # ADDITIONAL COMMON WORDS
    # ============================================================
    'אַלֻּף': ('H441', 'alluf', 'chief, duke', 'అధిపతి'),
    'אַלֻּפֵי': ('H441', 'allufei', 'chiefs of', 'అధిపతులు'),
    'מֶמְשָׁלָה': ('H4475', 'memshalah', 'dominion', 'ఆధిపత్యము'),
    'אֻמָּה': ('H523', 'ummah', 'nation', 'జాతి'),
    'לְאֻמִּים': ('H3816', 'leummim', 'peoples', 'ప్రజలు'),
    'לָשׁוֹן': ('H3956', 'lashon', 'tongue, language', 'భాష'),
    'בָּלַל': ('H1101', 'balal', 'confuse', 'కలగాపులగము చేయు'),
    'וַיָּפֶץ': ('H6327', 'vayyafets', 'and he scattered', 'చెదరగొట్టెను'),
    'פּוּץ': ('H6327', 'puts', 'scatter', 'చెదరగొట్టు'),
    'וַיַּחְדְּלוּ': ('H2308', 'vayyachdelu', 'and they stopped', 'ఆపివేసిరి'),
    'חָדַל': ('H2308', 'chadal', 'cease', 'ఆపు'),
'''

content = content.rstrip()
if content.endswith('}'):
    content = content[:-1] + new_words + '}'

with open('hebrew_word_dict.py', 'w', encoding='utf-8') as f:
    f.write(content)

new_count = content.count("': (")
print(f'New word count: {new_count}')
print(f'Added {new_count - count} more specialized words!')
