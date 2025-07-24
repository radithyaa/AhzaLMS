import { CloudUploadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

export function RenderEmptyState({isDragActive}: {isDragActive: boolean}){
    return(
        <div className="text-center hover:cursor-pointer">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted/10 mb-4">
                <CloudUploadIcon className={
                    `size-6 text-muted-foreground ${isDragActive && "text-primary"}`
                }/>
            </div>
            <p className="text-sm  text-foreground/85">
                Drop your files here or {" "}
                <span className="text-primary/85 md:font-semibold font-medium cursor-pointer">
                    Click to upload
                </span>
            </p>
            <Button type="button" className="mt-4 cursor-pointer">
                Select File
            </Button>
        </div>
    )
}

export function RenderErrorState({isDragActive}: {isDragActive: boolean}){
    return(
        <div className="text-center hover:cursor-pointer">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
            <ImageIcon className="size-6 text-destructive"/>
            </div>

            <p className="text-base font-semibold ">Upload Failed</p>
            <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
            <Button className="mt-4" type="button" variant={"outline"}>
                Retry File Selection
            </Button>
        </div>
    )
}