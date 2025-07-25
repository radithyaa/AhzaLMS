"use client"
import { useCallback, useState } from "react"
import {FileRejection, useDropzone} from "react-dropzone"
import { Card, CardContent } from "../ui/card"
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./RenderState"
import { toast } from "sonner"
import {v4 as uuidv4} from 'uuid';

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
        error: false ,
        fileType: "image" 
    })

    async function uploadFile(file: File){
        setFileState((prev)=> ({
            ...prev,
            uploading: true
        }))

        try{
        // 1. Get presigned URL

            const presignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true
                })
            })

            if(!presignedResponse.ok){
                toast.error("Failed to get presigned URL")
                setFileState((prev)=> ({
                ...prev,
                uploading: false,
                progress: 0,
                error: true
                }))

                return;
            }

            const {presignedUrl, key} = await presignedResponse.json()

            await new Promise<void> ((resolve, reject) => {
                const xhr = new XMLHttpRequest()

                xhr.upload.onprogress = (event) => {
                    if(event.lengthComputable){
                        const percentageCompleted  = (event.loaded / event.total) * 100
                        setFileState((prev)=> ({
                        ...prev,
                        progress: Math.round(percentageCompleted),
                        })) 
                    }
                }

                xhr.onload = () => {
                    if(xhr.status === 200 || xhr.status === 204){
                        setFileState((prev) => ({
                            ...prev,
                            progress: 100,
                            uploading: false,
                            key: key
                        }))

                        toast.success("File uploaded succesfully")

                        resolve()
                    } else {
                        reject(new Error ("Upload failed..."))
                    }
                }
                xhr.onerror = () => {
                        reject(new Error ("Upload failed"))
                    }

                    xhr.open("PUT", presignedUrl);
                    xhr.setRequestHeader("Content-Type", file.type);
                    xhr.send(file)
            })
        } catch(error) {
            toast.error(`Something went wrong: ${error instanceof Error ? error.message : ''}`);
            setFileState((prev) =>({
                ...prev,
                progress: 0,
                uploading: false,
                error: true,
            }))
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
                id: uuidv4(),
                isDeleting: false,
                fileType: "image"
            })

            uploadFile(file)
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

    function renderContent(){
        if (fileState.uploading) {
            return <RenderUploadingState file={fileState.file as File} progress={fileState.progress}/>
        }
        if(fileState.error){
            return <RenderErrorState/>
        }
        if(fileState.objectUrl) {
            return <RenderUploadedState previewUrl={fileState.objectUrl}/>
        }
        return <RenderEmptyState isDragActive={isDragActive}/>
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
                {renderContent()}
            </CardContent>
        </Card>
    )
}