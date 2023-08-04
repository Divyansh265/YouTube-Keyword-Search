// Replace 'YOUR_API_KEY' with your actual YouTube API key
const API_KEY = 'AIzaSyDNAP3-rf8tw6NqXQ_ODltxM9mGjKNFBYg';

function getSearchVolume() {
    const keyword = document.getElementById('keywordInput').value.trim();
    if (!keyword) {
        alert('Please enter a keyword');
        return;
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&key=${API_KEY}&maxResults=10`;

    axios.get(url)
        .then(response => {
            const videoIds = response.data.items.map(item => item.id.videoId);
            getVideoStats(videoIds);
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
}

function getVideoStats(videoIds) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(',')}&key=${API_KEY}`;

    axios.get(url)
        .then(response => {
            const videoStats = response.data.items.map(item => item.statistics);
            const searchVolume = calculateSearchVolume(videoStats);
            displaySearchVolume(searchVolume);
        })
        .catch(error => {
            console.error('Error fetching video statistics:', error);
        });
}

function calculateSearchVolume(videoStats) {
    let searchVolume = 0;
    for (const stats of videoStats) {
        const viewCount = parseInt(stats.viewCount, 10) || 0;
        const likeCount = parseInt(stats.likeCount, 10) || 0;
        const dislikeCount = parseInt(stats.dislikeCount, 10) || 0;
        const commentCount = parseInt(stats.commentCount, 10) || 0;

        searchVolume += viewCount + likeCount - dislikeCount + commentCount;
    }
    return searchVolume;
}


function displaySearchVolume(searchVolume) {
    const searchVolumeDiv = document.getElementById('searchVolume');
    searchVolumeDiv.textContent = `Search volume: ${searchVolume}`;
}
