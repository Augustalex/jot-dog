export default function Home() {
    const responses = [
        'Nothing to see here.',
        'Where you looking for something specific?',
        'Wrong URL, sorry.',
        'The right website lies within, not on a screen, especially not on your screen.',
        '*this is not the website you\'re looking for*',
        'Not looking for a job, sorry.',
        'This is not the right website for you, but look at the person to your right and tell them you found the right website for them.',
        'Not gonna lie. There are no hidden subpages on this site, this is really all there is.',
    ];
    const randomIndex = Math.round(Math.random() * (responses.length - 1));
    const response = responses[randomIndex];

    return (
        <main className="main">
            {response}
        </main>
    )
}
