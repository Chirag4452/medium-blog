import { AppBar } from "../components/AppBar"
import type { Blog } from "../hooks"
import { Avatar } from "../components/BlogCard"

export const FullBlog = ({ blog }: {blog: Blog}) => {
        return <div>
            <AppBar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-10 w-full pt-20 max-w-screen-xl gap-4">
                    <div className="col-span-8 p-4">
                        <div className="text-3xl font-extrabold">
                            {blog.title}
                        </div>
                        <div className="text-slate-500 pt-2">
                            Posted on 2nd December 2023
                        </div>
                        <div className="mt-4">
                            {blog.content}
                        </div>
                    </div>
                    <div className=" col-span-4 p-4 ">
                        <div className="text-slate-500 text-lg"> Author </div>
                        <div className="flex w-full">
                            <div className=" pr-5 flex flex-col justify-center">
                                <Avatar size="big" name={blog.author.name || "Anonymous"} />
                            </div>
                            <div>
                                <div className="text-xl font-bold">
                                    {blog.author.name || "Anonymous"}
                                </div>
                                <div className=" pt-2">
                                    Random catch phrase, about author here, his/her content and what the talk about
                                </div>
                            </div>
                        </div>
                    </div>                   
                </div>
            </div>       
    </div>
}