# Greek Word Dictionary for New Testament
# Contains Greek vocabulary with Strong's numbers, transliterations, English and Telugu meanings
# Based on Strong's Greek Concordance

CURATED_GREEK_WORDS = {
    # === CORE THEOLOGICAL TERMS ===
    # God and Divine
    'θεός': ('G2316', 'theos', 'God', 'దేవుడు'),
    'θεοῦ': ('G2316', 'theou', 'of God', 'దేవుని'),
    'κύριος': ('G2962', 'kyrios', 'Lord, master', 'ప్రభువు'),
    'κυρίου': ('G2962', 'kyriou', 'of the Lord', 'ప్రభువుయొక్క'),
    'πνεῦμα': ('G4151', 'pneuma', 'spirit, breath, wind', 'ఆత్మ'),
    'πνεύματος': ('G4151', 'pneumatos', 'of the spirit', 'ఆత్మయొక్క'),
    'ἅγιος': ('G40', 'hagios', 'holy, sacred', 'పవిత్రమైన'),
    'ἁγίου': ('G40', 'hagiou', 'of the holy', 'పవిత్రమైన'),
    
    # Christ and Messiah
    'Χριστός': ('G5547', 'Christos', 'Christ, Anointed One', 'క్రీస్తు - అభిషిక్తుడు'),
    'Χριστοῦ': ('G5547', 'Christou', 'of Christ', 'క్రీస్తు యొక్క'),
    'Ἰησοῦς': ('G2424', 'Iesous', 'Jesus', 'యేసు'),
    'Ἰησοῦ': ('G2424', 'Iesou', 'of Jesus', 'యేసు యొక్క'),
    'Μεσσίας': ('G3323', 'Messias', 'Messiah', 'మెస్సీయ'),
    
    # Salvation Terms
    'σωτήρ': ('G4990', 'soter', 'savior, deliverer', 'రక్షకుడు'),
    'σωτηρία': ('G4991', 'soteria', 'salvation, deliverance', 'రక్షణ'),
    'σῴζω': ('G4982', 'sozo', 'to save, rescue, deliver', 'రక్షించు'),
    
    # Love Terms
    'ἀγάπη': ('G26', 'agape', 'love (divine/unconditional)', 'ప్రేమ (దైవిక)'),
    'ἀγαπάω': ('G25', 'agapao', 'to love', 'ప్రేమించు'),
    'ἀγαπητός': ('G27', 'agapetos', 'beloved', 'ప్రియమైన'),
    'φιλέω': ('G5368', 'phileo', 'to love (friendly affection)', 'స్నేహించు'),
    
    # Faith and Belief
    'πίστις': ('G4102', 'pistis', 'faith, belief, trust', 'విశ్వాసము'),
    'πιστεύω': ('G4100', 'pisteuo', 'to believe, trust', 'నమ్ము'),
    'πιστός': ('G4103', 'pistos', 'faithful, trustworthy', 'నమ్మకమైన'),
    
    # Grace and Mercy
    'χάρις': ('G5485', 'charis', 'grace, favor', 'కృప'),
    'χάριτος': ('G5485', 'charitos', 'of grace', 'కృప యొక్క'),
    'ἔλεος': ('G1656', 'eleos', 'mercy, compassion', 'కనికరము'),
    
    # Truth and Knowledge
    'ἀλήθεια': ('G225', 'aletheia', 'truth', 'సత్యము'),
    'ἀληθής': ('G227', 'alethes', 'true', 'సత్యమైన'),
    'γινώσκω': ('G1097', 'ginosko', 'to know', 'తెలిసికొను'),
    'γνῶσις': ('G1108', 'gnosis', 'knowledge', 'జ్ఞానము'),
    'σοφία': ('G4678', 'sophia', 'wisdom', 'జ్ఞానము'),
    
    # Life and Death
    'ζωή': ('G2222', 'zoe', 'life', 'జీవము'),
    'ζάω': ('G2198', 'zao', 'to live', 'జీవించు'),
    'θάνατος': ('G2288', 'thanatos', 'death', 'మరణము'),
    'ἀπόθνῄσκω': ('G599', 'apothnesko', 'to die', 'చనిపోవు'),
    'ἀνάστασις': ('G386', 'anastasis', 'resurrection', 'పునరుత్థానము'),
    
    # Sin and Righteousness
    'ἁμαρτία': ('G266', 'hamartia', 'sin', 'పాపము'),
    'ἁμαρτάνω': ('G264', 'hamartano', 'to sin', 'పాపము చేయు'),
    'ἁμαρτωλός': ('G268', 'hamartolos', 'sinner, sinful', 'పాపి'),
    'δικαιοσύνη': ('G1343', 'dikaiosyne', 'righteousness', 'నీతి'),
    'δίκαιος': ('G1342', 'dikaios', 'righteous, just', 'నీతిమంతుడు'),
    'δικαιόω': ('G1344', 'dikaioo', 'to justify, declare righteous', 'నీతిమంతునిగా తీర్చు'),
    
    # Kingdom
    'βασιλεία': ('G932', 'basileia', 'kingdom, reign', 'రాజ్యము'),
    'βασιλεύς': ('G935', 'basileus', 'king', 'రాజు'),
    'βασιλεύω': ('G936', 'basileuo', 'to reign, be king', 'ఏలు'),
    
    # Church and Assembly
    'ἐκκλησία': ('G1577', 'ekklesia', 'church, assembly', 'సంఘము'),
    
    # Gospel and Preaching
    'εὐαγγέλιον': ('G2098', 'euangelion', 'gospel, good news', 'సువార్త'),
    'εὐαγγελίζω': ('G2097', 'euangelizo', 'to preach the gospel', 'సువార్త ప్రకటించు'),
    'κηρύσσω': ('G2784', 'kerusso', 'to proclaim, preach', 'ప్రకటించు'),
    
    # === COMMON VERBS ===
    # Being and Existence
    'εἰμί': ('G1510', 'eimi', 'to be, I am', 'ఉండు'),
    'ἐστίν': ('G1510', 'estin', 'is, it is', 'ఉన్నది'),
    'ἦν': ('G1510', 'en', 'was', 'ఉండెను'),
    'γίνομαι': ('G1096', 'ginomai', 'to become, happen', 'అగు'),
    'ἐγένετο': ('G1096', 'egeneto', 'it came to pass', 'జరిగెను'),
    
    # Speaking and Saying
    'λέγω': ('G3004', 'lego', 'to say, speak', 'చెప్పు'),
    'εἶπεν': ('G3004', 'eipen', 'he said', 'అతడు చెప్పెను'),
    'λαλέω': ('G2980', 'laleo', 'to speak', 'మాట్లాడు'),
    'λόγος': ('G3056', 'logos', 'word, speech, reason', 'వాక్యము - మాట'),
    
    # Doing and Making
    'ποιέω': ('G4160', 'poieo', 'to do, make', 'చేయు'),
    'ἔργον': ('G2041', 'ergon', 'work, deed', 'పని - క్రియ'),
    'ἐργάζομαι': ('G2038', 'ergazomai', 'to work', 'పని చేయు'),
    
    # Seeing and Perceiving
    'ὁράω': ('G3708', 'horao', 'to see', 'చూచు'),
    'εἶδον': ('G3708', 'eidon', 'I saw', 'చూచితిని'),
    'βλέπω': ('G991', 'blepo', 'to see, look at', 'చూచు'),
    'θεωρέω': ('G2334', 'theoreo', 'to observe, behold', 'దర్శించు'),
    
    # Coming and Going
    'ἔρχομαι': ('G2064', 'erchomai', 'to come, go', 'వచ్చు'),
    'ἦλθεν': ('G2064', 'elthen', 'he came', 'అతడు వచ్చెను'),
    'πορεύομαι': ('G4198', 'poreuomai', 'to go, journey', 'వెళ్ళు'),
    'ὑπάγω': ('G5217', 'hypago', 'to go away, depart', 'వెళ్ళిపోవు'),
    'ἀπέρχομαι': ('G565', 'aperchomai', 'to go away', 'వెళ్ళిపోవు'),
    
    # Hearing
    'ἀκούω': ('G191', 'akouo', 'to hear', 'విను'),
    'ἤκουσεν': ('G191', 'ekousen', 'he heard', 'అతడు విన్నాడు'),
    
    # Giving and Receiving
    'δίδωμι': ('G1325', 'didomi', 'to give', 'ఇచ్చు'),
    'ἔδωκεν': ('G1325', 'edoken', 'he gave', 'అతడు ఇచ్చెను'),
    'λαμβάνω': ('G2983', 'lambano', 'to receive, take', 'తీసికొను'),
    'ἔλαβεν': ('G2983', 'elaben', 'he received', 'అతడు పొందెను'),
    
    # Sending
    'ἀποστέλλω': ('G649', 'apostello', 'to send, send forth', 'పంపు'),
    'πέμπω': ('G3992', 'pempo', 'to send', 'పంపు'),
    
    # Wanting and Willing
    'θέλω': ('G2309', 'thelo', 'to will, wish, want', 'కోరు'),
    'βούλομαι': ('G1014', 'boulomai', 'to wish, purpose', 'కోరుకొను'),
    
    # === COMMON NOUNS ===
    # People
    'ἄνθρωπος': ('G444', 'anthropos', 'man, human being', 'మనుష్యుడు'),
    'ἀνήρ': ('G435', 'aner', 'man, husband', 'పురుషుడు'),
    'γυνή': ('G1135', 'gyne', 'woman, wife', 'స్త్రీ'),
    'υἱός': ('G5207', 'huios', 'son', 'కుమారుడు'),
    'τέκνον': ('G5043', 'teknon', 'child', 'బిడ్డ'),
    'πατήρ': ('G3962', 'pater', 'father', 'తండ్రి'),
    'μήτηρ': ('G3384', 'meter', 'mother', 'తల్లి'),
    'ἀδελφός': ('G80', 'adelphos', 'brother', 'సోదరుడు'),
    'ἀδελφή': ('G79', 'adelphe', 'sister', 'సోదరి'),
    
    # World and Creation
    'κόσμος': ('G2889', 'kosmos', 'world', 'లోకము'),
    'αἰών': ('G165', 'aion', 'age, eternity', 'యుగము'),
    'γῆ': ('G1093', 'ge', 'earth, land', 'భూమి'),
    'οὐρανός': ('G3772', 'ouranos', 'heaven, sky', 'ఆకాశము - పరలోకము'),
    'θάλασσα': ('G2281', 'thalassa', 'sea', 'సముద్రము'),
    
    # Time
    'ἡμέρα': ('G2250', 'hemera', 'day', 'దినము'),
    'νύξ': ('G3571', 'nyx', 'night', 'రాత్రి'),
    'ὥρα': ('G5610', 'hora', 'hour', 'గంట'),
    'καιρός': ('G2540', 'kairos', 'time, season', 'సమయము'),
    'χρόνος': ('G5550', 'chronos', 'time (duration)', 'కాలము'),
    
    # Body
    'σῶμα': ('G4983', 'soma', 'body', 'శరీరము'),
    'σάρξ': ('G4561', 'sarx', 'flesh', 'శరీరము - మాంసము'),
    'αἷμα': ('G129', 'haima', 'blood', 'రక్తము'),
    'καρδία': ('G2588', 'kardia', 'heart', 'హృదయము'),
    'ψυχή': ('G5590', 'psyche', 'soul, life', 'ప్రాణము - ఆత్మ'),
    'χείρ': ('G5495', 'cheir', 'hand', 'చెయ్యి'),
    'πούς': ('G4228', 'pous', 'foot', 'పాదము'),
    'ὀφθαλμός': ('G3788', 'ophthalmos', 'eye', 'కన్ను'),
    'οὖς': ('G3775', 'ous', 'ear', 'చెవి'),
    'στόμα': ('G4750', 'stoma', 'mouth', 'నోరు'),
    
    # Place
    'τόπος': ('G5117', 'topos', 'place', 'స్థలము'),
    'οἶκος': ('G3624', 'oikos', 'house, home', 'ఇల్లు'),
    'οἰκία': ('G3614', 'oikia', 'house, household', 'ఇల్లు'),
    'πόλις': ('G4172', 'polis', 'city', 'పట్టణము'),
    'ἱερόν': ('G2411', 'hieron', 'temple', 'దేవాలయము'),
    'ναός': ('G3485', 'naos', 'temple (inner sanctuary)', 'ఆలయము'),
    'συναγωγή': ('G4864', 'synagoge', 'synagogue', 'సమాజ మందిరము'),
    
    # Light and Darkness
    'φῶς': ('G5457', 'phos', 'light', 'వెలుగు'),
    'σκότος': ('G4655', 'skotos', 'darkness', 'చీకటి'),
    'σκοτία': ('G4653', 'skotia', 'darkness', 'చీకటి'),
    
    # Water and Bread
    'ὕδωρ': ('G5204', 'hydor', 'water', 'నీళ్ళు'),
    'ἄρτος': ('G740', 'artos', 'bread, loaf', 'రొట్టె'),
    'οἶνος': ('G3631', 'oinos', 'wine', 'ద్రాక్షారసము'),
    
    # === IMPORTANT ADJECTIVES ===
    'καλός': ('G2570', 'kalos', 'good, beautiful', 'మంచి'),
    'κακός': ('G2556', 'kakos', 'bad, evil', 'చెడ్డ'),
    'πονηρός': ('G4190', 'poneros', 'evil, wicked', 'దుష్టమైన'),
    'μέγας': ('G3173', 'megas', 'great, large', 'గొప్ప'),
    'μικρός': ('G3398', 'mikros', 'small, little', 'చిన్న'),
    'πολύς': ('G4183', 'polys', 'much, many', 'అనేకము'),
    'πᾶς': ('G3956', 'pas', 'all, every', 'అందరు - ప్రతి'),
    'ὅλος': ('G3650', 'holos', 'whole, entire', 'సమస్తము'),
    'ἴδιος': ('G2398', 'idios', 'one\'s own', 'సొంతమైన'),
    'ἕτερος': ('G2087', 'heteros', 'other, another', 'వేరొక'),
    'ἄλλος': ('G243', 'allos', 'another, other', 'మరొక'),
    'πρῶτος': ('G4413', 'protos', 'first', 'మొదటి'),
    'ἔσχατος': ('G2078', 'eschatos', 'last', 'చివరి'),
    'νέος': ('G3501', 'neos', 'new, young', 'క్రొత్త'),
    'παλαιός': ('G3820', 'palaios', 'old', 'పాత'),
    'αἰώνιος': ('G166', 'aionios', 'eternal, everlasting', 'నిత్యమైన'),
    
    # === PREPOSITIONS ===
    'ἐν': ('G1722', 'en', 'in, on, among', 'లో'),
    'εἰς': ('G1519', 'eis', 'into, to, for', 'లోనికి'),
    'ἐκ': ('G1537', 'ek', 'out of, from', 'నుండి'),
    'ἀπό': ('G575', 'apo', 'from, away from', 'నుండి'),
    'διά': ('G1223', 'dia', 'through, by means of', 'ద్వారా'),
    'ὑπό': ('G5259', 'hypo', 'by, under', 'క్రింద'),
    'ἐπί': ('G1909', 'epi', 'on, upon, over', 'మీద'),
    'πρός': ('G4314', 'pros', 'to, toward', 'వైపు'),
    'μετά': ('G3326', 'meta', 'with, after', 'తో'),
    'κατά': ('G2596', 'kata', 'according to, against', 'ప్రకారము'),
    'περί': ('G4012', 'peri', 'about, concerning', 'గురించి'),
    'παρά': ('G3844', 'para', 'beside, from', 'దగ్గర'),
    'ὑπέρ': ('G5228', 'hyper', 'above, on behalf of', 'కొరకు'),
    
    # === CONJUNCTIONS ===
    'καί': ('G2532', 'kai', 'and', 'మరియు'),
    'δέ': ('G1161', 'de', 'but, and', 'అయితే'),
    'ἀλλά': ('G235', 'alla', 'but, rather', 'కానీ'),
    'γάρ': ('G1063', 'gar', 'for, because', 'ఎందుకంటే'),
    'οὖν': ('G3767', 'oun', 'therefore, then', 'కాబట్టి'),
    'ὅτι': ('G3754', 'hoti', 'that, because', 'ఏలయనగా'),
    'ἵνα': ('G2443', 'hina', 'that, in order that', 'అను'),
    'εἰ': ('G1487', 'ei', 'if', 'అయితే'),
    'ἐάν': ('G1437', 'ean', 'if', 'అయితే'),
    'ὡς': ('G5613', 'hos', 'as, like', 'వలె'),
    
    # === PRONOUNS ===
    'ἐγώ': ('G1473', 'ego', 'I', 'నేను'),
    'σύ': ('G4771', 'sy', 'you (singular)', 'నీవు'),
    'αὐτός': ('G846', 'autos', 'he, she, it, self', 'అతడు'),
    'ἡμεῖς': ('G2249', 'hemeis', 'we', 'మేము'),
    'ὑμεῖς': ('G5210', 'hymeis', 'you (plural)', 'మీరు'),
    'οὗτος': ('G3778', 'houtos', 'this', 'ఇతడు'),
    'ἐκεῖνος': ('G1565', 'ekeinos', 'that', 'అతడు'),
    'ὅς': ('G3739', 'hos', 'who, which', 'ఎవడు'),
    'τίς': ('G5101', 'tis', 'who? what?', 'ఎవరు?'),
    
    # === ARTICLES ===
    'ὁ': ('G3588', 'ho', 'the (masc)', '-'),
    'ἡ': ('G3588', 'he', 'the (fem)', '-'),
    'τό': ('G3588', 'to', 'the (neut)', '-'),
    'τοῦ': ('G3588', 'tou', 'of the', '-'),
    'τῷ': ('G3588', 'to', 'to the', '-'),
    'τόν': ('G3588', 'ton', 'the (acc)', '-'),
    
    # === NEGATIVES ===
    'οὐ': ('G3756', 'ou', 'not', 'కాదు'),
    'οὐκ': ('G3756', 'ouk', 'not (before vowel)', 'కాదు'),
    'μή': ('G3361', 'me', 'not (subjunctive)', 'వద్దు'),
    'οὐδείς': ('G3762', 'oudeis', 'no one, nothing', 'ఎవరు కాదు'),
    
    # === ADVERBS ===
    'νῦν': ('G3568', 'nyn', 'now', 'ఇప్పుడు'),
    'τότε': ('G5119', 'tote', 'then', 'అప్పుడు'),
    'πάλιν': ('G3825', 'palin', 'again', 'తిరిగి'),
    'ἐκεῖ': ('G1563', 'ekei', 'there', 'అక్కడ'),
    'ὧδε': ('G5602', 'hode', 'here', 'ఇక్కడ'),
    'πῶς': ('G4459', 'pos', 'how?', 'ఎలా?'),
    'οὕτως': ('G3779', 'houtos', 'thus, so', 'ఈలాగు'),
    'ἀμήν': ('G281', 'amen', 'amen, truly', 'ఆమేన్ - నిజముగా'),
    
    # === NUMBERS ===
    'εἷς': ('G1520', 'heis', 'one', 'ఒకటి'),
    'δύο': ('G1417', 'duo', 'two', 'రెండు'),
    'τρεῖς': ('G5140', 'treis', 'three', 'మూడు'),
    'τέσσαρες': ('G5064', 'tessares', 'four', 'నాలుగు'),
    'πέντε': ('G4002', 'pente', 'five', 'ఐదు'),
    'ἕξ': ('G1803', 'hex', 'six', 'ఆరు'),
    'ἑπτά': ('G2033', 'hepta', 'seven', 'ఏడు'),
    'ὀκτώ': ('G3638', 'okto', 'eight', 'ఎనిమిది'),
    'ἐννέα': ('G1767', 'ennea', 'nine', 'తొమ్మిది'),
    'δέκα': ('G1176', 'deka', 'ten', 'పది'),
    'δώδεκα': ('G1427', 'dodeka', 'twelve', 'పన్నెండు'),
    
    # === GOSPEL NAMES ===
    'Πέτρος': ('G4074', 'Petros', 'Peter', 'పేతురు'),
    'Παῦλος': ('G3972', 'Paulos', 'Paul', 'పౌలు'),
    'Ἰωάννης': ('G2491', 'Ioannes', 'John', 'యోహాను'),
    'Μαρία': ('G3137', 'Maria', 'Mary', 'మరియ'),
    'Ἀβραάμ': ('G11', 'Abraam', 'Abraham', 'అబ్రాహాము'),
    'Δαυίδ': ('G1138', 'Dauid', 'David', 'దావీదు'),
    'Μωϋσῆς': ('G3475', 'Mouses', 'Moses', 'మోషే'),
    'Ἰσραήλ': ('G2474', 'Israel', 'Israel', 'ఇశ్రాయేలు'),
    'Ἰερουσαλήμ': ('G2419', 'Ierousalem', 'Jerusalem', 'యెరూషలేము'),
    'Γαλιλαία': ('G1056', 'Galilaia', 'Galilee', 'గలిలయ'),
    
    # === IMPORTANT THEOLOGICAL CONCEPTS ===
    'μετάνοια': ('G3341', 'metanoia', 'repentance', 'మారుమనస్సు'),
    'μετανοέω': ('G3340', 'metanoeo', 'to repent', 'మారుమనస్సు పొందు'),
    'βάπτισμα': ('G908', 'baptisma', 'baptism', 'బాప్తిస్మము'),
    'βαπτίζω': ('G907', 'baptizo', 'to baptize', 'బాప్తిస్మము ఇచ్చు'),
    'ἄφεσις': ('G859', 'aphesis', 'forgiveness, release', 'క్షమాపణ'),
    'ἀφίημι': ('G863', 'aphiemi', 'to forgive, leave', 'క్షమించు'),
    'διαθήκη': ('G1242', 'diatheke', 'covenant, testament', 'నిబంధన'),
    'ὑπομονή': ('G5281', 'hypomone', 'patience, endurance', 'ఓర్పు'),
    'ἐλπίς': ('G1680', 'elpis', 'hope', 'నిరీక్షణ'),
    'εἰρήνη': ('G1515', 'eirene', 'peace', 'సమాధానము'),
    'χαρά': ('G5479', 'chara', 'joy', 'సంతోషము'),
    'δόξα': ('G1391', 'doxa', 'glory', 'మహిమ'),
    'δοξάζω': ('G1392', 'doxazo', 'to glorify', 'మహిమపరచు'),
    'δύναμις': ('G1411', 'dynamis', 'power, miracle', 'శక్తి'),
    'ἐξουσία': ('G1849', 'exousia', 'authority, power', 'అధికారము'),
    'σημεῖον': ('G4592', 'semeion', 'sign, miracle', 'సూచన'),
    'θαῦμα': ('G2295', 'thauma', 'wonder, marvel', 'ఆశ్చర్యము'),
    'παραβολή': ('G3850', 'parabole', 'parable', 'ఉపమానము'),
    'μαθητής': ('G3101', 'mathetes', 'disciple', 'శిష్యుడు'),
    'ἀπόστολος': ('G652', 'apostolos', 'apostle, messenger', 'అపొస్తలుడు'),
    'προφήτης': ('G4396', 'prophetes', 'prophet', 'ప్రవక్త'),
    'διδάσκαλος': ('G1320', 'didaskalos', 'teacher', 'బోధకుడు'),
    'διδάσκω': ('G1321', 'didasko', 'to teach', 'బోధించు'),
    'ἀκολουθέω': ('G190', 'akoloutheo', 'to follow', 'వెంబడించు'),
    'σταυρός': ('G4716', 'stauros', 'cross', 'సిలువ'),
    'σταυρόω': ('G4717', 'stauroo', 'to crucify', 'సిలువ వేయు'),
    'νεκρός': ('G3498', 'nekros', 'dead', 'మృతుడు'),
    'ἐγείρω': ('G1453', 'egeiro', 'to raise, rise', 'లేపు'),
    'κρίνω': ('G2919', 'krino', 'to judge', 'తీర్పు తీర్చు'),
    'κρίσις': ('G2920', 'krisis', 'judgment', 'తీర్పు'),
    'ὀργή': ('G3709', 'orge', 'wrath, anger', 'కోపము'),
    'διάβολος': ('G1228', 'diabolos', 'devil, slanderer', 'అపవాది'),
    'Σατανᾶς': ('G4567', 'Satanas', 'Satan', 'సాతాను'),
    'δαιμόνιον': ('G1140', 'daimonion', 'demon', 'దయ్యము'),
    'ἄγγελος': ('G32', 'angelos', 'angel, messenger', 'దూత'),
    'προσευχή': ('G4335', 'proseuche', 'prayer', 'ప్రార్థన'),
    'προσεύχομαι': ('G4336', 'proseuchomai', 'to pray', 'ప్రార్థించు'),
    'νόμος': ('G3551', 'nomos', 'law', 'ధర్మశాస్త్రము'),
    'ἐντολή': ('G1785', 'entole', 'commandment', 'ఆజ్ఞ'),
    'γραφή': ('G1124', 'graphe', 'scripture, writing', 'లేఖనము'),
}
