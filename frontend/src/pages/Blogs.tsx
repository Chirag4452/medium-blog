import { BlogCard } from "../components/BlogCard"
import { AppBar } from "../components/AppBar";
import { useBlogs } from "../hooks"

export const Blogs = () => {
    const {loading, blogs} = useBlogs();

    if (loading) {
        return <div>
            loading ...
        </div>
    }
    return <div>
        <AppBar />
        <div  className="flex justify-center">
        <div className=" max-w-xl">
            {blogs.map(blog => (
                <BlogCard
                id={blog.id}
                authorName={blog.author.name || "Anonymus"}
                title={blog.title}
                content={blog.content}
                publishedDate={"18 jan 2025"}
            />
            ))}
        </div>
        </div>
    </div>
}