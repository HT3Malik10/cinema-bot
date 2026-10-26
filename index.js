const { Client } = require('discord.js-selfbot-v13');
const { Streamer, streamVideo } = require('@djs-dev/vocal');

const client = new Client();
const streamer = new Streamer(client);

// 🎬 Mets ici tes liens directs de films français (.mp4)
const movies = [
    { title: "Film 1", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { title: "Film 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
];

const VOICE_CHANNEL_ID = '1564233839075926017';
const GUILD_ID = '1564229938515681342';

let currentIndex = 0;

async function startStreamLoop() {
    if (movies.length === 0) {
        console.log("❌ Aucun film dans la liste !");
        return;
    }

    const currentMovie = movies[currentIndex];
    console.log(`🎬 Diffusion en cours : ${currentMovie.title}`);

    try {
        // Connexion au vocal et lancement du stream
        await streamer.joinVoice(GUILD_ID, VOICE_CHANNEL_ID);
        
        const udp = await streamer.createStream({
            fps: 30,
            bitrate: 3000,
            type: 'go-live'
        });

        // Lecture du lien vidéo en direct vers Discord
        await streamVideo(currentMovie.url, udp);

        console.log(`✅ Fin du film : ${currentMovie.title}. Passage au suivant...`);
    } catch (err) {
        console.error("⚠️ Erreur pendant le stream :", err);
    }

    // Passer au film suivant dans la liste (et boucle au début si c'est le dernier)
    currentIndex = (currentIndex + 1) % movies.length;
    
    // Petite pause de 5 secondes avant de lancer le film suivant
    setTimeout(startStreamLoop, 5000);
}

client.on('ready', () => {
    console.log(`🍿 Bot connecté : ${client.user.tag}`);
    startStreamLoop();
});

// Connexion sécurisée via l'environnement Render
client.login(process.env.DISCORD_TOKEN);
