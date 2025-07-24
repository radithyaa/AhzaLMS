"use client"
import { useCallback, useState } from "react"
import {FileRejection, useDropzone} from "react-dropzone"
import { Card, CardContent } from "../ui/card"
import { RenderEmptyState, RenderErrorState } from "./RenderState"
import { toast } from "sonner"
import {v7 as uuidv7} from 'uuid';

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video"; 
}

export function Uploader({...props}){
    const [fileState, setFileState] = useState<UploaderState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: "image"
    })

    function uploadFile(file: File){
        setFileState((prev)=> ({
            ...prev,
            uploading: true
        }))

        try{
            
        } catch {

        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if(acceptedFiles.length > 0){
            const file = acceptedFiles[0];

            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv7(),
                isDeleting: false,
                fileType: "image"
            })
        }
    }, [])

    function rejectedFiles(fileRejections: FileRejection[]) {
        fileRejections.forEach((rejection) => {
            rejection.errors.forEach((error) => {
            switch (error.code) {
                case "file-too-large":
                toast.error("File size exceeds the 3MB limit");
                break;
                case "file-too-small":
                toast.error("File size is too small");
                break;
                case "too-many-files":
                toast.error("Too many files selected, only 1 file allowed");
                break;
                case "file-invalid-type":
                toast.error("Invalid file type, only image files are allowed");
                break;
                case "too-few-files":
                toast.error("Too few files selected");
                break;
                default:
                toast.error(`Upload error: ${error.message}`);
            }
            });
        });
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {"image/*": []},
        maxFiles: 1,
        multiple: false,
        maxSize: 3 * 1024 *1024, // 5 Mb
        onDropRejected: rejectedFiles,
    })
    return(
        <Card 
          {...getRootProps()}
          className={`
            relative border-2 border-dashed transition-colors duration-200
            ease-in-out w-full h-64 
            ${isDragActive? "border-primary bg-primary/10 border-solid"
            : "border-border hover:border-primary/50"}`}
          >
            <CardContent className="flex items-center justify-center h-full w-full"> 
                <input {...getInputProps()} />
                <RenderEmptyState isDragActive={isDragActive}/>
                {/* <RenderErrorState isDragActive={isDragActive}/> */}
            </CardContent>
        </Card>
    )
}