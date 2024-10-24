export default function PostList({ posts, type }) {
  if (!posts || posts.length === 0) {
    return <p>No posts found.</p>;
  }

  return (
    <div className="grid gap-4">
      {posts.map((post, index) => (
        <div key={index} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow">
          {type === 'reddit' ? (
            <div>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600">Author: {post.author}</p>
              <p className="text-gray-600">Score: {post.score}</p>
              <p className="text-gray-600">Comments: {post.comments}</p>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                View Post
              </a>
            </div>
          ) : (
            <div>
              <p className="mb-2">{post.text}</p>
              <p className="text-sm text-gray-500">Posted: {post.timestamp}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}