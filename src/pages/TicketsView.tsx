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
    IonButtons, IonMenuButton
} from '@ionic/react';

import api from "../api";

interface MenuState {
    data: any;
    date: Date;
}
interface Props {
    id: number
}

export default class Menu extends Component<Props, MenuState> {

    constructor(props : any) {
        super(props)
        this.state = {
            date: new Date(),
            data: null
        }
    }

    async reloadList() {

        let data = (await api.getTicket(this.props.id)).data
        console.log(data);
        this.setState({data});
    }

    async componentDidMount() {
        await this.reloadList();

    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<MenuState>, snapshot?: any) {
        if(prevProps.id !== this.props.id) this.reloadList();
    }

    componentWillUnmount() {

    }

    render() {

        // eslint-disable-next-line react-hooks/rules-of-hooks


        let data = this.state.data;
        if(!data) return (<div>Loading</div>);
        // @ts-ignore
        return (

            <IonPage>
                <IonHeader>
                    <IonToolbar>

                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>{data.index.overview.name}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>

                    {data.index.tickets.map((ticketRef : any)=>{

                        let ticket = data.assets.Ticket[ticketRef.id]
                        ticket.customer = ticket.customer_id ? data.assets.User[ticket.customer_id] : {}
                        ticket.organization = ticket.customer.organization_id ? data.assets.Organization[ticket.customer.organization_id] : {}

                        return (

                        <IonCard key={ticket.id}>
                            <IonCardHeader>
                                <IonCardSubtitle>{ticket.customer.firstname} {ticket.customer.lastname} @ {ticket.organization.name}</IonCardSubtitle>
                                <IonCardTitle>{ticket.title}</IonCardTitle>
                            </IonCardHeader>

                            {/* <IonCardContent>
                                Keep close to Nature's heart... and break clear away, once in awhile,
                                and climb a mountain or spend a week in the woods. Wash your spirit clean.
                            </IonCardContent> */}
                        </IonCard>
                    )
                    })}

                </IonContent>
            </IonPage>

        );
    }
}


