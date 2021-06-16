import React, {Component} from "react";
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
    IonButtons, IonMenuButton, IonRefresher, IonRefresherContent, useIonActionSheet, IonActionSheet
} from '@ionic/react';

import api from "../api";
import CreateTicketAttachment from "./CreateTicketAttachment";
import Loading from "../Loading";
import {RefresherEventDetail} from '@ionic/core';
import { appsOutline } from "ionicons/icons";
import TimeAgo from 'timeago-react'


interface MenuState {
    data: any;
    date: Date;
    showStateChange: boolean
}

interface Props {
    id: number
}

let stateOptions : Array<any> = [];

export default class Menu extends Component<Props, MenuState> {

    constructor(props: any) {
        super(props)
        this.state = {
            date: new Date(),
            data: null,
            showStateChange: false
        }
    }

    async reloadList() {

        let data = (await api.getTicket(this.props.id)).data
        console.log(data);
        this.setState({data});
    }

    async componentDidMount() {
        this.getStateOptions();
        await this.reloadList();

    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<MenuState>, snapshot?: any) {
        if (prevProps.id !== this.props.id) {
            this.setState({data: null});
            this.reloadList();
        }
    }

    componentWillUnmount() {

    }

    getReplyToAddress() {
        let data = this.state.data;
        let customerId = data.assets.Ticket[this.props.id].customer_id;
        let article = data.assets.TicketArticle[[...data.ticket_article_ids].reverse().find(ticketRef => {
            let article = data.assets.TicketArticle[ticketRef]
            if (article.created_by_id === customerId) return true;
        })]

        if (article && article.created_by === customerId) return article.from;
        return data.assets.User[customerId].email || data.assets.User[customerId].mobile;
    }

    handleNewReply(article: any) {
        this.state.data.ticket_article_ids.push(article.id);
        this.state.data.assets.TicketArticle[article.id] = article;
        this.setState({data: this.state.data});
    }

    getStateOptions(){
        if(!stateOptions.length){
            api.getStates().then(res=>stateOptions=res.data);
        }
        if(!this.state.data) return [];

        return stateOptions.map(state=>{
            return {
                text: state.name,
                role: state.id===this.state.data.assets.Ticket[this.props.id].state_id?"destructive":"",
                disabled: true,
                handler: () => this.setTicketState(state.id)
            }
        })
    }

    async setTicketState(stateId: number){
        await api.updateTicket({
            id:this.props.id,
            state_id: stateId
        });

        await this.reloadList();
    }

    render() {

        // eslint-disable-next-line react-hooks/rules-of-hooks

        let data = this.state.data;
        if (!data || !data.assets.Ticket[this.props.id]) return (<Loading/>)




        let ticket = data.assets.Ticket[this.props.id];
        // @ts-ignore
        return (

            <IonPage>
                <IonHeader>
                    <IonToolbar>

                        <IonButtons slot="start">
                            <IonMenuButton/>
                        </IonButtons>
                        <IonTitle>{ticket.title}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={()=>this.setState({showStateChange: true})}>
                                <IonIcon slot="end" icon={appsOutline} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent style={{"padding-top": "60px"}}>

                    <IonRefresher slot={"fixed"} onIonRefresh={(e) => this.reloadList().then(d => e.detail.complete())}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>

                    <IonList>

                        {data.ticket_article_ids.map((ticketRef: any) => {

                            let article = data.assets.TicketArticle[ticketRef]
                            article.created_by = article.created_by_id ? data.assets.User[article.created_by_id] : {}
                            article.organization = article.created_by.organization_id ? data.assets.Organization[article.created_by.organization_id] : {}

                            return (

                                <IonItem key={article.id}>
                                    <IonLabel>
                                        <p style={{"float":"right"}}><TimeAgo datetime={article.created_at} /></p>
                                        <h2>{article.subject}</h2>
                                        <h3>{article.created_by.firstname && article.created_by.firstname.length > 1 ? (
                                            <span>{article.created_by.firstname} {article.created_by.lastname} @ {article.organization.name}</span>) : article.from}</h3>


                                        {/*
                                            //@ts-ignore */}
                                        <p style={{"white-space": "normal"}}
                                           dangerouslySetInnerHTML={{__html: article.body}}/>
                                    </IonLabel>


                                </IonItem>
                            )
                        })}

                        <CreateTicketAttachment to={this.getReplyToAddress()}
                                                typeId={data.assets.TicketArticle[data.ticket_article_ids[0]].type_id}
                                                ticketId={ticket.id} onSubmit={this.handleNewReply.bind(this)}/>

                    </IonList>

                    <IonActionSheet
                        isOpen={this.state.showStateChange}
                        onDidDismiss={() => this.setState({showStateChange:false})}
                        cssClass='my-custom-class'
                        buttons={this.getStateOptions()}
                    >
                    </IonActionSheet>
                </IonContent>
            </IonPage>

        );
    }
}


