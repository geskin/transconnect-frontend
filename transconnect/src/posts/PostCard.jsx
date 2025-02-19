const PostCard = ({
    title,
    id,
    createdAt,
    editedAt,
    content,
    user,
    comments }) => {

    return (
        <Link className="card" to={`/posts/${id}`}>
            <div className="card-body">
                <h3>{user.username}</h3>
                <h6 className="card-title text-start">
                    {title}
                </h6>
                <p className="text-start"><small>{content}</small></p>
                <i>{createdAt}</i>
            </div>
        </Link>
    );
}

export default PostCard;