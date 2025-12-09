// Data for the Seven Churches of Revelation (Rev 2-3)

export interface Church {
    id: string;
    name: string;
    modernName: string;
    image: string;
    passage: string;
    reference: string;
    commendation: string | null;
    criticism: string | null;
    exhortation: string;
    promise: string;
    historicalContext: string;
    keyVerses: { ref: string; text: string }[];
    crossReferences: string[];
}

export const revelationChurches: Church[] = [
    {
        id: 'ephesus',
        name: 'Ephesus',
        modernName: 'Selçuk, Turkey',
        image: '/ephesus.png',
        passage: 'Revelation 2:1-7',
        reference: 'Rev 2:1-7',
        commendation: 'Hard work, perseverance, tested false apostles, hated Nicolaitans.',
        criticism: 'Forsaken your first love.',
        exhortation: 'Remember the height from which you have fallen! Repent and do the things you did at first.',
        promise: 'To him who overcomes, I will give the right to eat from the tree of life, which is in the paradise of God.',
        historicalContext: 'Ephesus was the largest and most important city in Asia Minor. Home to the Temple of Artemis (one of the Seven Wonders). Paul spent 3 years here establishing the church (Acts 19). Timothy and John later ministered here.',
        keyVerses: [
            { ref: 'Rev 2:4', text: 'Nevertheless I have somewhat against thee, because thou hast left thy first love.' },
            { ref: 'Rev 2:5', text: 'Remember therefore from whence thou art fallen, and repent, and do the first works.' },
            { ref: 'Rev 2:7', text: 'He that hath an ear, let him hear what the Spirit saith unto the churches; To him that overcometh will I give to eat of the tree of life.' }
        ],
        crossReferences: ['Acts 19:1-41', 'Ephesians 1:1', '1 Timothy 1:3', 'Acts 20:17-38']
    },
    {
        id: 'smyrna',
        name: 'Smyrna',
        modernName: 'Izmir, Turkey',
        image: '/smyrna.png',
        passage: 'Revelation 2:8-11',
        reference: 'Rev 2:8-11',
        commendation: 'Rich despite poverty, endured persecution from those claiming to be Jews.',
        criticism: null,
        exhortation: 'Do not be afraid of what you are about to suffer. Be faithful, even to the point of death.',
        promise: 'He who overcomes will not be hurt at all by the second death.',
        historicalContext: 'Smyrna was a wealthy port city known for its loyalty to Rome. Christians faced severe persecution here. Polycarp, disciple of John, was martyred here around 155 AD. One of only two churches with no criticism.',
        keyVerses: [
            { ref: 'Rev 2:9', text: 'I know thy works, and tribulation, and poverty, (but thou art rich).' },
            { ref: 'Rev 2:10', text: 'Fear none of those things which thou shalt suffer... be thou faithful unto death, and I will give thee a crown of life.' }
        ],
        crossReferences: ['James 2:5', 'Matthew 5:10-12', '2 Corinthians 8:9']
    },
    {
        id: 'pergamos',
        name: 'Pergamos',
        modernName: 'Bergama, Turkey',
        image: '/pergamos.png',
        passage: 'Revelation 2:12-17',
        reference: 'Rev 2:12-17',
        commendation: 'Remained true to Christ\'s name, did not renounce faith even when Antipas was martyred.',
        criticism: 'Some hold to the teaching of Balaam and Nicolaitans.',
        exhortation: 'Repent therefore! Otherwise, I will soon come to you and will fight against them with the sword of my mouth.',
        promise: 'To him who overcomes, I will give some of the hidden manna. I will also give him a white stone with a new name.',
        historicalContext: 'Pergamos was called "where Satan has his throne" - likely referring to the massive altar of Zeus. Known for emperor worship and the temple of Asclepius (healing). Had the second-largest library in the ancient world.',
        keyVerses: [
            { ref: 'Rev 2:13', text: 'I know thy works, and where thou dwellest, even where Satan\'s seat is.' },
            { ref: 'Rev 2:16', text: 'Repent; or else I will come unto thee quickly, and will fight against them with the sword of my mouth.' },
            { ref: 'Rev 2:17', text: 'To him that overcometh will I give to eat of the hidden manna, and will give him a white stone.' }
        ],
        crossReferences: ['Numbers 22-24 (Balaam)', 'Numbers 31:16', '2 Peter 2:15', 'Jude 1:11']
    },
    {
        id: 'thyatira',
        name: 'Thyatira',
        modernName: 'Akhisar, Turkey',
        image: '/thyatira.png',
        passage: 'Revelation 2:18-29',
        reference: 'Rev 2:18-29',
        commendation: 'Love, faith, service, perseverance. Doing more than at first.',
        criticism: 'Tolerating Jezebel who calls herself a prophetess and leads people into immorality.',
        exhortation: 'Hold on to what you have until I come.',
        promise: 'To him who overcomes and does my will to the end, I will give authority over the nations. I will also give him the morning star.',
        historicalContext: 'Thyatira was famous for trade guilds, especially purple dye production. Lydia, Paul\'s first European convert, was from Thyatira (Acts 16:14). The guilds often involved pagan worship, creating pressure for Christians.',
        keyVerses: [
            { ref: 'Rev 2:19', text: 'I know thy works, and charity, and service, and faith, and thy patience, and thy works; and the last to be more than the first.' },
            { ref: 'Rev 2:26-28', text: 'He that overcometh, and keepeth my works unto the end, to him will I give power over the nations... And I will give him the morning star.' }
        ],
        crossReferences: ['Acts 16:14-15', '1 Kings 16:31 (Jezebel)', '1 Kings 21:25', 'Psalm 2:8-9']
    },
    {
        id: 'sardis',
        name: 'Sardis',
        modernName: 'Sart, Turkey',
        image: '/sardis.png',
        passage: 'Revelation 3:1-6',
        reference: 'Rev 3:1-6',
        commendation: 'A few people who have not soiled their clothes.',
        criticism: 'You have a reputation of being alive, but you are dead. Works not complete before God.',
        exhortation: 'Wake up! Strengthen what remains. Remember what you received and heard; obey it, and repent.',
        promise: 'He who overcomes will be dressed in white. I will never blot out his name from the book of life.',
        historicalContext: 'Sardis was once a wealthy powerful city, capital of the Lydian kingdom. Claimed to be impregnable but was conquered twice by enemies climbing the cliffs at night while guards slept. Known for complacency.',
        keyVerses: [
            { ref: 'Rev 3:1', text: 'I know thy works, that thou hast a name that thou livest, and art dead.' },
            { ref: 'Rev 3:2', text: 'Be watchful, and strengthen the things which remain, that are ready to die.' },
            { ref: 'Rev 3:5', text: 'He that overcometh... I will not blot out his name out of the book of life.' }
        ],
        crossReferences: ['Matthew 24:42-44', '1 Thessalonians 5:2-6', 'Luke 12:35-40']
    },
    {
        id: 'philadelphia',
        name: 'Philadelphia',
        modernName: 'Alaşehir, Turkey',
        image: '/philadelphia.png',
        passage: 'Revelation 3:7-13',
        reference: 'Rev 3:7-13',
        commendation: 'Kept my word, not denied my name despite little strength.',
        criticism: null,
        exhortation: 'Hold on to what you have, so that no one will take your crown.',
        promise: 'I will make him a pillar in the temple of my God. I will write on him the name of my God, the new Jerusalem, and my new name.',
        historicalContext: 'Philadelphia means "brotherly love." Founded to spread Greek culture. Plagued by earthquakes. One of only two churches with no criticism. Known as "Little Athens." The open door may refer to missionary opportunity.',
        keyVerses: [
            { ref: 'Rev 3:8', text: 'I know thy works: behold, I have set before thee an open door, and no man can shut it.' },
            { ref: 'Rev 3:10', text: 'Because thou hast kept the word of my patience, I also will keep thee from the hour of temptation.' },
            { ref: 'Rev 3:12', text: 'Him that overcometh will I make a pillar in the temple of my God.' }
        ],
        crossReferences: ['Isaiah 22:22', '1 Corinthians 16:9', 'Colossians 4:3', 'Revelation 21:2']
    },
    {
        id: 'laodicea',
        name: 'Laodicea',
        modernName: 'Denizli, Turkey',
        image: '/laodicea.png',
        passage: 'Revelation 3:14-22',
        reference: 'Rev 3:14-22',
        commendation: null,
        criticism: 'Neither cold nor hot - lukewarm. Say "I am rich" but are wretched, pitiful, poor, blind, and naked.',
        exhortation: 'Buy from me gold refined in fire, white clothes, and salve for your eyes. Be earnest and repent.',
        promise: 'To him who overcomes, I will give the right to sit with me on my throne.',
        historicalContext: 'Laodicea was extremely wealthy, known for banking, black wool, and eye medicine. After an earthquake, refused Roman aid saying "we need nothing." Aqueducts brought lukewarm water - neither hot (therapeutic) nor cold (refreshing).',
        keyVerses: [
            { ref: 'Rev 3:15-16', text: 'I know thy works, that thou art neither cold nor hot... So then because thou art lukewarm, and neither cold nor hot, I will spue thee out of my mouth.' },
            { ref: 'Rev 3:17', text: 'Because thou sayest, I am rich... and knowest not that thou art wretched, and miserable, and poor, and blind, and naked.' },
            { ref: 'Rev 3:20', text: 'Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him.' }
        ],
        crossReferences: ['Colossians 4:13-16', 'Hosea 12:8', 'Matthew 6:19-21', 'John 9:39-41']
    }
];
