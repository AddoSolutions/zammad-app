import React, {Component, useState} from "react";
import ReactDOM from "react-dom";

import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonButtons, IonMenuButton, IonItemDivider, IonInput, IonToggle
} from '@ionic/react';
// @ts-ignore
import { CKEditor } from "@ckeditor/ckeditor5-react";
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./CreateTicketAttachment.css"

import api from "../api";

interface StateInterface {
    record: {
        ticket_id: number,
        to: string,
        cc?: string,
        subject?: string,
        body: string,
        content_type: string,
        type?: string,
        type_id?: number,
        internal: boolean,
        time_unit?: string };
    date: Date;
    clicked: Array<string>
}
interface PropsInterface {
    ticketId: number,
    to: string,
    typeId: number,
    onSubmit?: Function,
}

export default class Menu extends Component<PropsInterface, StateInterface> {



    constructor(props : any) {
        super(props)
        this.state = this.getResetState();
    }

    getResetState(){
        return {
            date: new Date(),
            clicked: [],
            record: {
                ticket_id: this.props.ticketId,
                to: this.props.to,
                body: "<p></p>",
                content_type: "text/html",
                internal: false,
            }
        }
    }

    handleInputChange(name: string, value: any, record : Object) {
        // @ts-ignore
        record[name] = value;

        this.setState({
            record: this.state.record
        });
        console.log(this.state)
    }

    getProps(name : string, required : boolean, record : Object){
        if(!record) record = this.state.record;
        if(name.includes(".")){
            let parts=name.split(".");
            while(parts.length > 1){
                // @ts-ignore
                record=record[parts.shift()];
            }
            name=parts.shift() as string;
        }


        return {
            // @ts-ignore
            value: record[name]===undefined?"":record[name],
            onChange: (e : React.ChangeEvent<HTMLInputElement>)=>this.handleInputChange(name, e.target.value, record),
            onIonChange: (e : any)=>this.handleInputChange(name, e.detail.value,record),
            name: name,
            // @ts-ignore
            valid: (!required||record[name]) && (this.state.clicked.includes(name)),
            // @ts-ignore
            invalid: required&&!record[name] && (this.state.clicked.includes(name) || this.state.submitAttempted),
            required,
            onClick: ()=>{
                // @ts-ignore
                this.state.clicked.includes(name) || this.state.clicked.push(name);
                // @ts-ignore
                this.setState({clicked: this.state.clicked})
            }
        }
    }

    async componentDidMount() {

        this.setState(this.getResetState())

    }

    componentDidUpdate(prevProps: Readonly<PropsInterface>, prevState: Readonly<StateInterface>, snapshot?: any) {
        let updated : any = false;
        if(prevProps.ticketId !== this.props.ticketId) this.state.record.ticket_id = updated = this.props.ticketId;
        if(prevProps.to !== this.props.to) this.state.record.to = updated = this.props.to;
        if(updated) this.setState({record:this.state.record})
    }

    componentWillUnmount() {

    }

    async submit(){
        let data = this.state.record;
        if(data.internal){
            data.type="note"
        }else{
            data.type="email"
            data.type_id = this.props.typeId;
        }
        let article = await api.createTicketArticle(this.state.record)
        if(this.props.onSubmit) this.props.onSubmit(article.data);
        this.setState(this.getResetState())
    }

    render() {

        // eslint-disable-next-line react-hooks/rules-of-hooks


        let data = this.state.record;

        return (


            <IonList>
                <IonListHeader>
                    <IonLabel><h4>New Reply</h4></IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonLabel> To</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <IonInput {...this.getProps("to")}></IonInput>
                </IonItem>

                {!!this.props.ticketId || (
                <IonItem>
                    <IonLabel position="floating">Ticket Title</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <IonInput {...this.getProps("title")}></IonInput>
                </IonItem>
                )}

                <IonItem>
                    <IonLabel>{this.state.record.internal?"Internal Note":"Public Message"}</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <IonToggle checked={!this.state.record.internal} onIonChange={e => this.state.record.internal = e.detail.checked} />
                </IonItem>

                <IonItemDivider>Message</IonItemDivider>
                <CKEditor
                    editor={ ClassicEditor }
                    data={this.state.record.body}
                    onReady={ (editor: any) => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event: any, editor: { getData: () => any; } ) => {
                        this.handleInputChange("body",editor.getData(),this.state.record);
                    } }
                />
                <IonItem>
                    <IonLabel position="floating">Account Time</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <IonInput {...this.getProps("time_unit")}></IonInput>
                </IonItem>

                <IonButton expand="full" onClick={this.submit.bind(this)}>Send Message</IonButton>

            </IonList>

        );
    }
}


