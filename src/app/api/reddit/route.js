// app/utils/redditScraper.js
import axios from 'axios';

const getPosts = async (subredditName) => {
    const userAgent = 'your_user_agent'; // Replace with your user agent
    const response = await axios.get(`https://www.reddit.com/r/${subredditName}/new.json`, {
        headers: { 'User-Agent': userAgent },
    });

    const posts = response.data.data.children;

    const postsData = await Promise.all(posts.map(async (post) => {
        const postData = post.data;
        const commentsResponse = await axios.get(`https://www.reddit.com/r/${subredditName}/comments/${postData.id}.json`, {
            headers: { 'User-Agent': userAgent },
        });

        const comments = commentsResponse.data[1].data.children.map(comment => comment.data);
        return { ...postData, comments };
    }));

    return postsData;
};

export default getPosts;
