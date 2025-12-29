# Script to add even more specialized Hebrew words - Batch 4
with open('hebrew_word_dict.py', 'r', encoding='utf-8') as f:
    content = f.read()

count = content.count("': (")
print(f'Current word count: {count}')

new_words = '''
    # ============================================================
    # COMMON SUFFIXED FORMS
    # ============================================================
    'אֶרְצוֹ': ('H776', 'artso', 'his land', 'అతని దేశము'),
    'אַרְצָהּ': ('H776', 'artsah', 'her land', 'ఆమె దేశము'),
    'אֶרֶץ': ('H776', 'erets', 'land, earth', 'భూమి'),
    'עָרָיו': ('H5892', 'arav', 'his cities', 'అతని పట్టణములు'),
    'בֵּיתוֹ': ('H1004', 'beito', 'his house', 'అతని ఇల్లు'),
    'שְׁמוֹ': ('H8034', 'shemo', 'his name', 'అతని పేరు'),
    'שֶׁמְךָ': ('H8034', 'shimkha', 'your name', 'నీ పేరు'),
    'שְׁמִי': ('H8034', 'shemi', 'my name', 'నా పేరు'),
    'יְמֵיהֶם': ('H3117', 'yemeihem', 'their days', 'వారి దినములు'),
    'יָמָיו': ('H3117', 'yamav', 'his days', 'అతని దినములు'),
    'יָמַי': ('H3117', 'yamay', 'my days', 'నా దినములు'),
    'דַּרְכּוֹ': ('H1870', 'darko', 'his way', 'అతని మార్గము'),
    'דְּרָכָיו': ('H1870', 'derakhav', 'his ways', 'అతని మార్గములు'),
    'דְּבָרָיו': ('H1697', 'devarav', 'his words', 'అతని మాటలు'),
    'דְּבָרֶיךָ': ('H1697', 'devarekha', 'your words', 'నీ మాటలు'),
    'נַפְשׁוֹ': ('H5315', 'nafsho', 'his soul', 'అతని ప్రాణము'),
    'נַפְשִׁי': ('H5315', 'nafshi', 'my soul', 'నా ప్రాణము'),
    'נַפְשְׁךָ': ('H5315', 'nafshekha', 'your soul', 'నీ ప్రాణము'),
    'לִבּוֹ': ('H3820', 'libbo', 'his heart', 'అతని హృదయము'),
    'לִבִּי': ('H3820', 'libbi', 'my heart', 'నా హృదయము'),
    'לִבְּךָ': ('H3820', 'libbekha', 'your heart', 'నీ హృదయము'),

    # ============================================================
    # RELATIVE AND TIME EXPRESSIONS
    # ============================================================
    'בָּרִאשׁוֹנָה': ('H7223', 'barishonah', 'at first', 'మొదట'),
    'בָּאַחֲרוֹנָה': ('H314', 'baacharonah', 'at last', 'చివరకు'),
    'בַּיָּמִים הָהֵם': ('H3117', 'bayyamim hahem', 'in those days', 'ఆ దినములలో'),
    'בָּעֵת הַהִיא': ('H6256', 'bait hahi', 'at that time', 'ఆ సమయమున'),
    'עַד הַיּוֹם הַזֶּה': ('H3117', 'ad hayyom hazeh', 'until this day', 'నేటివరకు'),
    'מֵאֹלָם': ('H5769', 'meolam', 'from of old', 'పూర్వమునుండి'),
    'לְעוֹלָם': ('H5769', 'leolam', 'forever', 'నిత్యము'),
    'עַד עוֹלָם': ('H5769', 'ad olam', 'forever', 'నిత్యము'),
    'לְדֹר וָדֹר': ('H1755', 'ledor vador', 'from generation to generation', 'తరతరములకు'),
    'דּוֹר': ('H1755', 'dor', 'generation', 'తరము'),
    'דּוֹרוֹת': ('H1755', 'dorot', 'generations', 'తరములు'),

    # ============================================================
    # MORE COMMON EXPRESSIONS
    # ============================================================
    'מָה זֶּה': ('H4100', 'mah zeh', 'what is this?', 'ఇదేమిటి?'),
    'מִי זֶה': ('H4310', 'mi zeh', 'who is this?', 'ఇదెవరు?'),
    'מִי הוּא': ('H4310', 'mi hu', 'who is he?', 'అతడెవరు?'),
    'מַה לְּךָ': ('H4100', 'mah lekha', 'what is to you?', 'నీకేమి?'),
    'אֵי מִזֶּה': ('H335', 'ei mizzeh', 'from where?', 'ఎక్కడనుండి?'),
    'אֵי לָכֶם': ('H335', 'ei lakhem', 'where to you?', 'మీరెక్కడికి?'),
    'עַד מָתַי': ('H4970', 'ad matay', 'until when?', 'ఎప్పటివరకు?'),
    'עַד אָנָה': ('H575', 'ad anah', 'how long?', 'ఎంతకాలము?'),
    'כָּמָּה': ('H4100', 'kammah', 'how much?', 'ఎంత?'),
    'לָמָּה זֶּה': ('H4100', 'lammah zeh', 'why this?', 'ఇదెందుకు?'),

    # ============================================================
    # ADDITIONAL VERBS - QAL STEM
    # ============================================================
    'גָּדַל': ('H1431', 'gadal', 'grow, become great', 'పెరుగు'),
    'וַיִּגְדַּל': ('H1431', 'vayyigdal', 'and he grew', 'పెరిగెను'),
    'שָׂרָה': ('H8280', 'sarah', 'strive, contend', 'పోరాడు'),
    'וַיִּשָּׂר': ('H8280', 'vayyissar', 'and he strove', 'పోరాడెను'),
    'נָגַע': ('H5060', 'naga', 'touch', 'ముట్టు'),
    'וַיִּגַּע': ('H5060', 'vayyigga', 'and he touched', 'ముట్టెను'),
    'נָגַף': ('H5062', 'nagaf', 'strike', 'కొట్టు'),
    'וַיִּגֹּף': ('H5062', 'vayyiggof', 'and he struck', 'కొట్టెను'),
    'נָצַל': ('H5337', 'natsal', 'deliver', 'విడిపించు'),
    'וַיַּצֵּל': ('H5337', 'vayyatsel', 'and he delivered', 'విడిపించెను'),
    'עָצַר': ('H6113', 'atsar', 'restrain', 'ఆపు'),
    'וַיַּעֲצֹר': ('H6113', 'vayyaatsor', 'and he restrained', 'ఆపెను'),
    'פָּקַד': ('H6485', 'paqad', 'visit, appoint', 'సందర్శించు'),
    'וַיִּפְקֹד': ('H6485', 'vayyifqod', 'and he visited', 'సందర్శించెను'),
    'פָּדָה': ('H6299', 'padah', 'redeem', 'విమోచించు'),
    'וַיִּפְדֶּה': ('H6299', 'vayyifdeh', 'and he redeemed', 'విమోచించెను'),
    'קָנָה': ('H7069', 'qanah', 'acquire, buy', 'కొను'),
    'וַיִּקֶן': ('H7069', 'vayyiqen', 'and he bought', 'కొనెను'),
    'מָכַר': ('H4376', 'makhar', 'sell', 'అమ్ము'),
    'וַיִּמְכֹּר': ('H4376', 'vayyimkor', 'and he sold', 'అమ్మెను'),
    'שָׁאַל': ('H7592', 'shaal', 'ask', 'అడుగు'),
    'וַיִּשְׁאַל': ('H7592', 'vayyishal', 'and he asked', 'అడిగెను'),
    'עָנָה': ('H6030', 'anah', 'answer', 'జవాబిచ్చు'),
    'וַיַּעַן': ('H6030', 'vayyaan', 'and he answered', 'జవాబిచ్చెను'),
    'חָלָה': ('H2470', 'chalah', 'be sick', 'రోగము వచ్చు'),
    'וַיֶּחֱלִי': ('H2470', 'vayyecheli', 'and he was sick', 'రోగియాయెను'),
    'רָפָא': ('H7495', 'rafa', 'heal', 'స్వస్థపరచు'),
    'וַיִּרְפָּא': ('H7495', 'vayyirpa', 'and he healed', 'స్వస్థపరచెను'),

    # ============================================================
    # CLOTHING AND TEXTILE TERMS
    # ============================================================
    'שִׂמְלָה': ('H8071', 'simlah', 'garment', 'వస్త్రము'),
    'מְעִיל': ('H4598', 'meil', 'robe', 'అంగీ'),
    'כֶּסֶת': ('H3801', 'ketonet', 'coat, tunic', 'అంగీ'),
    'צָמִיד': ('H6781', 'tsamid', 'bracelet', 'కంకణము'),
    'נֶזֶם': ('H5141', 'nezem', 'ring, earring', 'ముక్కర'),
    'טַבַּעַת': ('H2885', 'tabbaat', 'ring', 'ఉంగరము'),
    'עֲטָרָה': ('H5850', 'atarah', 'crown', 'కిరీటము'),
    'צָעִיף': ('H6809', 'tsaif', 'veil', 'ముసుగు'),
    'מִטְפַּחַת': ('H4304', 'mitpachat', 'cloak', 'తట్టె'),
    'אֵזוֹר': ('H232', 'ezor', 'belt', 'నడికట్టు'),
    'נַעַל': ('H5275', 'naal', 'sandal', 'చెప్పు'),
    'מִצְנֶפֶת': ('H4701', 'mitsnefet', 'turban', 'పాగా'),

    # ============================================================
    # BUILDING AND CONSTRUCTION
    # ============================================================
    'יְסוֹד': ('H3247', 'yesod', 'foundation', 'పునాది'),
    'קִיר': ('H7023', 'qir', 'wall', 'గోడ'),
    'גָּג': ('H1406', 'gag', 'roof', 'పైకప్పు'),
    'דֶּלֶת': ('H1817', 'delet', 'door', 'తలుపు'),
    'חַלּוֹן': ('H2474', 'challon', 'window', 'కిటికీ'),
    'עַמּוּד': ('H5982', 'ammud', 'pillar', 'స్తంభము'),
    'מַדְרֵגָה': ('H4609', 'madregah', 'step', 'మెట్టు'),
    'סֻלָּם': ('H5551', 'sullam', 'ladder', 'నిచ్చెన'),
    'חֲצֵר': ('H2691', 'chatser', 'court', 'ఆవరణము'),
    'הֵיכָל': ('H1964', 'heikhal', 'palace, temple', 'మందిరము'),
    'בִּירָה': ('H1002', 'birah', 'citadel', 'కోట'),
    'מִבְצָר': ('H4013', 'mivtsar', 'fortress', 'కోట'),
'''

content = content.rstrip()
if content.endswith('}'):
    content = content[:-1] + new_words + '}'

with open('hebrew_word_dict.py', 'w', encoding='utf-8') as f:
    f.write(content)

new_count = content.count("': (")
print(f'New word count: {new_count}')
print(f'Added {new_count - count} more specialized words!')
