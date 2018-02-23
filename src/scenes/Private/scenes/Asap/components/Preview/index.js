import React from 'react'
import PreviewPlayer from '../PreviewPlayer'
import AppearanceController from '../AppearanceController'
import * as _ from "lodash";


class Preview extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            files: [],
            previews: [],
            colors: [],
            attachIdx: -1
        }
        this.saveFile = this.saveFile.bind(this)
        this.getImages = this.getImages.bind(this)
        this.clearAttachCall = this.clearAttachCall.bind(this)
        this.triggerAttachCall = this.triggerAttachCall.bind(this)
    }
    saveFile(files){
        this.setState((prevState)=>{
            let newFiles = prevState.files.slice()
            let newPreviews = prevState.previews.slice()
            const images = files.map((file) => {
                let image = {
                    local: file.preview,
                    base64: ''
                }
                this.getDataUri(file.preview, (dataUri)=> {
                    image.base64 = dataUri
                })
                return image
            })

            newFiles = newFiles.concat(files)
            newPreviews = newPreviews.concat(images)
            return{
                files: newFiles,
                previews: newPreviews
            }
        })
    }
    getImages(){
        this.state.files.map(file => {
            this.getDataUri(file.preview, (dataUri)=>{
                console.log(dataUri)
            });
        })
    }
    getDataUri(url, callback) {
        let image = new Image();
        image.crossOrigin = "Anonymous";

        image.onload = function () {
            let canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

            canvas.getContext('2d').drawImage(this, 0, 0);

            callback(canvas.toDataURL('image/png'));
        };

        image.src = url;
    }
    triggerAttachCall(idx){
        if(idx!=this.state.attachIdx
        && idx < this.state.previews.length){
            this.setState({
                attachIdx: idx
            })
        }

    }
    clearAttachCall(){
        if(this.state.attachIdx!=-1){
            this.setState({
                attachIdx: -1
            })
        }

    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
    }
    shouldComponentUpdate(nextProps, nextState){
        if(!_.isEqual(this.state, nextState)){
            return true
        }
        return false
    }
    render(){
        return (
            <React.Fragment>
                <PreviewPlayer images={this.state.previews} clearAttachCall={this.clearAttachCall} attachIdx={this.state.attachIdx}/>
                <AppearanceController saveFile={this.saveFile} files={this.state.files} triggerAttachCall={this.triggerAttachCall}/>
            </React.Fragment>

        )
    }
}




export default Preview
