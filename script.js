let debounceTimer;
 const DEBOUNCE_DELAY = 300;
 //Limit outputs by 10 searches
 const RESULTS_PER_PAGE = 10;
 let currentPage = 1;
 let currentResults = [];
 const WIKIPEDIA_API= "https://en.wikipedia.org/w/api.php"; // Wikipedia API URL
 const wikicache = {};
 
 // Our custom corpus of data

 const analyticsData = [
    // Social Media (Expanded)
    { id: 1, title: "Instagram", content: "A popular photo and video sharing platform owned by Meta. Users can share content with filters and hashtags.", url: "https://www.instagram.com/", tags: ["Social", "Photos", "Videos", "Meta"], category: "Social Media" },
    { id: 2, title: "Facebook", content: "Social networking service for connecting with friends, family and communities worldwide.", url: "https://www.facebook.com/", tags: ["Social", "Networking", "Meta"], category: "Social Media" },
    { id: 3, title: "X (Twitter)", content: "Microblogging platform for short messages called posts, formerly known as Twitter.", url: "https://twitter.com/", tags: ["Social", "Microblogging", "News"], category: "Social Media" },
    { id: 4, title: "TikTok", content: "Video-sharing platform specializing in short-form user videos, owned by ByteDance.", url: "https://www.tiktok.com/", tags: ["Social", "Videos", "Short-form"], category: "Social Media" },
    { id: 5, title: "LinkedIn", content: "Professional networking platform for job seekers, recruiters, and businesses.", url: "https://www.linkedin.com/", tags: ["Social", "Networking", "Jobs", "LinkedIn"], category: "Social Media" },
    { id: 23, title: "Pinterest", content: "A visual discovery engine for finding ideas like recipes, home and style inspiration, and more.", url: "https://www.pinterest.com/", tags: ["Social", "Visual", "Inspiration"], category: "Social Media" },
    { id: 24, title: "Snapchat", content: "A multimedia messaging app used for sharing photos, videos, and text that disappear after a short time.", url: "https://www.snapchat.com/", tags: ["Social", "Messaging", "Ephemeral"], category: "Social Media" },
    { id: 25, title: "Reddit", content: "A network of communities where people can dive into their interests, share news, and have discussions.", url: "https://www.reddit.com/", tags: ["Social", "Forums", "Community"], category: "Social Media" },
    { id: 26, title: "Telegram", content: "A cloud-based mobile and desktop messaging app with a focus on security and speed.", url: "https://telegram.org/", tags: ["Social", "Messaging", "Security"], category: "Social Media" },
    { id: 27, title: "Discord", content: "A voice, video, and text communication service used by over a hundred million people to hang out and talk with their friends and communities.", url: "https://discord.com/", tags: ["Social", "Communication", "Gaming"], category: "Social Media" },

    // Lebanese Universities (Expanded)
    { id: 6, title: "Beirut Arab University", content: "Private university in Beirut offering undergraduate and graduate programs since 1960.", url: "https://www.bau.edu.lb/", tags: ["University","BAU", "Beirut", "Higher Education"], category: "Education" },
    { id: 7, title: "American University of Beirut", content: "Leading private university in Lebanon founded in 1866, offering American-style education.", url: "https://www.aub.edu.lb/", tags: ["University", "Beirut", "AUB", "Higher Education"], category: "Education" },
    { id: 8, title: "Lebanese American University", content: "Private university with campuses in Beirut and Byblos, established in 1835.", url: "https://www.lau.edu.lb/", tags: ["University", "Beirut", "Byblos", "Higher Education", "LAU"], category: "Education" },
    { id: 28, title: "Saint Joseph University of Beirut (USJ)", content: "A private Catholic research university in Beirut, founded in 1875.", url: "https://www.usj.edu.lb/", tags: ["University", "Beirut", "USJ", "Higher Education"], category: "Education" },
    { id: 29, title: "Notre Dame University – Louaize (NDU)", content: "An independent Catholic university in Lebanon with a main campus in Zouk Mosbeh.", url: "https://www.ndu.edu.lb/", tags: ["University", "Lebanon", "NDU", "Higher Education"], category: "Education" },
    { id: 30, title: "Holy Spirit University of Kaslik (USEK)", content: "A private, non-profit Catholic university located in Kaslik, Lebanon.", url: "https://www.usek.edu.lb/", tags: ["University", "Lebanon", "USEK", "Higher Education"], category: "Education" },

    // Technology (Expanded)
    { id: 9, title: "Apple", content: "Technology company known for iPhone, Mac, iPad, and other consumer electronics.", url: "https://www.apple.com/", tags: ["Tech", "iPhone", "Mac", "iOS"], category: "Technology" },
    { id: 10, title: "Samsung", content: "South Korean electronics company producing smartphones, TVs, and home appliances.", url: "https://www.samsung.com/", tags: ["Tech", "Android", "Smartphones", "Galaxy"], category: "Technology" },
    { id: 11, title: "Google", content: "Multinational tech company specializing in search, advertising, and cloud computing.", url: "https://www.google.com/", tags: ["Tech", "Search", "Android", "Pixel"], category: "Technology" },
    { id: 12, title: "GitHub", content: "Platform for version control and collaboration using Git repositories.", url: "https://github.com/", tags: ["Tech", "Programming", "Code", "Git"], category: "Technology" },
    { id: 31, title: "Microsoft", content: "Technology corporation producing computer software, consumer electronics, and personal computers.", url: "https://www.microsoft.com/", tags: ["Tech", "Windows", "Software", "Xbox"], category: "Technology" },
    { id: 32, title: "Amazon", content: "Multinational technology company focusing on e-commerce, cloud computing, digital streaming, and AI.", url: "https://www.amazon.com/", tags: ["Tech", "E-commerce", "Cloud", "AWS"], category: "Technology" },
    { id: 33, title: "Tesla", content: "Automotive and energy company specializing in electric vehicles, battery energy storage, and solar panel manufacturing.", url: "https://www.tesla.com/", tags: ["Tech", "Electric Vehicles", "Automotive", "Energy"], category: "Technology" },
    { id: 34, title: "Intel", content: "Multinational corporation and technology company that designs and manufactures microprocessors and other semiconductor products.", url: "https://www.intel.com/", tags: ["Tech", "Processors", "Semiconductors", "CPU"], category: "Technology" },

    // University Portals (Expanded)
    { id: 13, title: "iconnect BAU", content: "Beirut Arab University's student portal for academic services and information.", url: "https://iconnect.bau.edu.lb/", tags: ["Portal", "BAU", "Student"], category: "Portals" },
    { id: 14, title: "BAU Moodle", content: "Learning management system for Beirut Arab University courses and materials.", url: "https://moodle.bau.edu.lb/", tags: ["LMS", "E-learning", "BAU"], category: "Portals" },
    { id: 35, title: "AUB Banner", content: "American University of Beirut's system for student records and administrative tasks.", url: "https://banner.aub.edu.lb/", tags: ["Portal", "AUB", "Student"], category: "Portals" },
    { id: 36, title: "LAU Portal", content: "Lebanese American University's online portal for students and faculty.", url: "https://portal.lau.edu.lb/", tags: ["Portal", "LAU", "Student", "Faculty"], category: "Portals" },

    // Lebanese News (Expanded)
    { id: 15, title: "MTV Lebanon", content: "Leading Lebanese television news station providing local and international news.", url: "https://www.mtv.com.lb/", tags: ["News", "Lebanon", "Broadcast", "MTV"], category: "News" },
    { id: 16, title: "LBCI Lebanon", content: "Lebanese Broadcasting Corporation International news and entertainment channel.", url: "https://www.lbci.com/", tags: ["News", "Lebanon", "LBC", "LBCI"], category: "News" },
    { id: 38, title: "Annahar", content: "A major Lebanese Arabic-language daily newspaper.", url: "https://www.annahar.com/", tags: ["News", "Lebanon", "Newspaper", "Arabic"], category: "News" },
    { id: 39, title: "Al Akhbar", content: "A Lebanese Arabic-language daily newspaper with a focus on political and social issues.", url: "https://al-akhbar.com/", tags: ["News", "Lebanon", "Newspaper", "Arabic", "Politics"], category: "News" },
    { id: 40, title: "The Daily Star (Lebanon)", content: "Lebanon's leading English-language newspaper.", url: "http://www.dailystar.com.lb/", tags: ["News", "Lebanon", "Newspaper", "English"], category: "News" },

    // AI Platforms (Expanded)
    { id: 17, title: "ChatGPT", content: "AI chatbot developed by OpenAI capable of natural language conversations.", url: "https://chat.openai.com/", tags: ["AI", "Chatbot", "OpenAI"], category: "AI" },
    { id: 18, title: "Gemini", content: "Google's AI chatbot and assistant competing with ChatGPT.", url: "https://gemini.google.com/", tags: ["AI", "Google", "Chatbot"], category: "AI" },
    { id: 19, title: "Claude", content: "AI assistant created by Anthropic focused on helpful, harmless conversations.", url: "https://claude.ai/", tags: ["AI", "Anthropic", "Chatbot"], category: "AI" },
    { id: 20, title: "DeepSeek", content: "AI research organization developing advanced machine learning models.", url: "https://deepseek.com/", tags: ["AI", "Research", "LLM"], category: "AI" },
    { id: 41, title: "Midjourney", content: "An independent research lab producing an AI program that generates images from textual descriptions.", url: "https://www.midjourney.com/", tags: ["AI", "Image Generation", "Art"], category: "AI" },
    { id: 42, title: "DALL-E 2", content: "An AI system by OpenAI that can create realistic images and art from descriptions in natural language.", url: "https://openai.com/dall-e-2/", tags: ["AI", "Image Generation", "OpenAI", "Art"], category: "AI" },
    { id: 43, title: "Stable Diffusion", content: "A deep learning text-to-image model released in 2022 based on diffusion techniques.", url: "https://stablediffusion.com/", tags: ["AI", "Image Generation", "Open Source"], category: "AI" },

    // Streaming and Entertainment (Expanded)
    { id: 21, title: "Netflix", content: "Popular streaming service offering movies, TV shows, and original content.", url: "https://www.netflix.com/", tags: ["Streaming", "Movies", "TV Shows", "Netflix"], category: "Streaming" },
    { id: 22, title: "Youtube", content: "Video-sharing platform for user-generated content and professional media.", url: "https://www.youtube.com/", tags: ["Streaming", "Video", "YouTube"], category: "Streaming" },
    { id: 44, title: "Amazon Prime Video", content: "Streaming service included with an Amazon Prime membership, offering a wide range of movies and TV shows.", url: "https://www.amazon.com/primevideo", tags: ["Streaming", "Movies", "TV Shows", "Amazon"], category: "Streaming" },
    { id: 45, title: "Disney+", content: "Streaming service from Disney featuring content from Disney, Pixar, Marvel, Star Wars, and National Geographic.", url: "https://www.disneyplus.com/", tags: ["Streaming", "Movies", "TV Shows", "Disney"], category: "Streaming" },
    { id: 46, title: "Spotify", content: "A digital music, podcast, and video service that gives you access to millions of songs and other content from creators all over the world.", url: "https://www.spotify.com/", tags: ["Streaming", "Music", "Podcasts"], category: "Streaming" },

 ];

 // Initialize the search page
 window.onload = function() {
     const urlParams = new URLSearchParams(window.location.search);
     const searchQuery = urlParams.get('q');
     
     if (searchQuery) {
         document.getElementById('searchInput').value = searchQuery;
         performSearch();
     }
     
     // Setup form submission
     document.getElementById('searchForm').addEventListener('submit', function(e) {
         e.preventDefault();
         performSearch();
     });
     
     // Setup input event listener with debouncing
     document.getElementById('searchInput').addEventListener('input', function() {
         clearTimeout(debounceTimer);
         debounceTimer = setTimeout(() => {
             const query = this.value.trim();
             if (query.length >= 2) {
                 performSearch();
             } else {
                 document.getElementById('results').innerHTML = '';
             }
         }, DEBOUNCE_DELAY);
     });
 };

 

 // Wikipedia search function
async function searchWikipedia(query) {
   
    // Check cache first
    if (wikicache[query]) return wikicache[query];
    
    try {
        const response = await fetch(
            `${WIKIPEDIA_API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
        );
        const data = await response.json();

        // Check if the response contains search results
        const results = data.query.search.map(result => ({
            id: `wiki-${result.pageid}`,
            title: result.title,
            content: result.snippet.replace(/<[^>]+>/g, ''), // Remove HTML tags
            url: `https://en.wikipedia.org/?curid=${result.pageid}`,
            tags: ["Wikipedia", "Encyclopedia"],
            category: "Reference",
            date: new Date().toISOString().split('T')[0],
            source: "wikipedia"
        }));
        
        // Cache results
        wikicache[query] = results;
        return results;
    } catch (error) {
        console.error("Wikipedia search failed:", error);
        return [];
    }
}

// Perform search and display results
async function performSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('results');
    
    // Clear previous results
    resultsContainer.innerHTML = '<div class="loading">Consulting the Well of Wisdom...</div>';
    
    // Validate query
    if (query.length < 2) {
        showMessage("Please enter at least 2 characters", "error");
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Get search options
    const exactMatch = document.getElementById('exactMatch').checked;
    const recentFirst = document.getElementById('recentFirst').checked;
    
    // Search local corpus
    const localResults = searchData(query, exactMatch);
    
    // Search Wikipedia (only if query is substantial)
    let wikipediaResults = [];
    if (query.length > 3) { // Only search Wikipedia for longer queries
        wikipediaResults = await searchWikipedia(query);
    }
    
    // Combine results
    let allResults = [...localResults, ...wikipediaResults];
    
    // Sort if needed
    if (recentFirst) {
        allResults.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        // Default sort by relevance (Wikipedia results get a base score)
        allResults.forEach(item => {
            if (!item.score) item.score = 1; // Base score for Wikipedia results
        });
        allResults.sort((a, b) => b.score - a.score);
    }
    
    // Reset to first page
    currentPage = 1;
    currentResults = allResults;
    displayResults();
    
    // Track search
    trackSearch(query, allResults.length);
}

 function searchData(query, exactMatch = false) {
     const terms = exactMatch ? [query] : query.split(' ');
     
     return analyticsData.map(item => {
         let score = 0;
         
         // Title matches are most important
         terms.forEach(term => {
             if (item.title && item.title.toLowerCase().includes(term)) {
                 score += 3;
             }
         });
         
         // Content matches
         terms.forEach(term => {
             if (item.content && item.content.toLowerCase().includes(term)) {
                 score += 1;
             }
         });
         
         // Tag matches
         terms.forEach(term => {
             if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term))) {
                 score += 2;
             }
         });
         
         // URL matches
         terms.forEach(term => {
             if (item.url && item.url.toLowerCase().includes(term)) {
                 score += 3;
             }
         });
         
         // Category matches
         terms.forEach(term => {
             if (item.category && item.category.toLowerCase().includes(term)) {
                 score += 1.5;
             }
         });
         
         return { ...item, score };
     })
     .filter(item => item.score > 0)
     .sort((a, b) => b.score - a.score);
 }

 // Display results in the results container
 function displayResults() {
    const resultsContainer = document.getElementById('results');
    const startIdx = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIdx = startIdx + RESULTS_PER_PAGE;
    const pageResults = currentResults.slice(startIdx, endIdx);
    
    if (pageResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>No results found for "${document.getElementById('searchInput').value.trim()}"</p>
                <p>Try different search terms or check your spelling.</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    pageResults.forEach(item => {
        const resultElement = document.createElement('div');
        resultElement.className = item.source === 'wikipedia' ? 
            'search-result wiki-result' : 'search-result';
        
        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        const title = highlightMatches(item.title, query);
        const snippet = highlightMatches(
            item.content.substring(0, 200) + (item.content.length > 200 ? '...' : ''), 
            query
        );
        
        resultElement.innerHTML = `
            <div class="${item.source === 'wikipedia' ? 'wiki-label' : 'category-label'}">
                ${item.source === 'wikipedia' ? 'Wikipedia' : item.category}
            </div>
            <h3><a href="${item.url}" target="_blank">${title}</a></h3>
            <div class="result-url">${item.url}</div>
            <p class="result-snippet">${snippet}</p>
            ${item.tags ? `<div class="tags">${item.tags.map(tag => 
                `<span class="tag">${tag}</span>`).join(' ')}</div>` : ''}
        `;
        
        resultsContainer.appendChild(resultElement);
    });
}

// Highlight matched query terms in results
 function highlightMatches(text, query) {
     if (!text) return '';
     
     const terms = query.split(' ');
     let highlighted = text;
     
     terms.forEach(term => {
         if (term.length >= 2) { // Only highlight terms with 2+ characters
             const regex = new RegExp(term, 'gi');
             highlighted = highlighted.replace(regex, 
                 match => `<span class="highlight">${match}</span>`);
         }
     });
     
     return highlighted;
 }

 // Track search analytics
 function showMessage(message, type) {
     const notification = document.createElement('div');
     notification.className = `notification ${type}`;
     notification.textContent = message;
     document.body.appendChild(notification);
     
     setTimeout(() => {
         notification.remove();
     }, 3000);
 }