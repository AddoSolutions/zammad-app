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
    overviewData: any;
    date: Date;
}
interface Props {
    link: string
}

export default class Menu extends Component<Props, MenuState> {

    constructor(props : any) {
        super(props)
        this.state = {
            date: new Date(),
            overviewData: null
        }
    }

    async reloadList() {

        let overviewData = (await api.getOverviewTickets(this.props.link)).data
        console.log(overviewData);
        this.setState({overviewData});
    }

    async componentDidMount() {
        await this.reloadList();

    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<MenuState>, snapshot?: any) {
        if(prevProps.link !== this.props.link) this.reloadList();
    }

    componentWillUnmount() {

    }

    render() {

        // eslint-disable-next-line react-hooks/rules-of-hooks


        let data = this.state.overviewData;
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
                <IonList>

                    {data.index.tickets.map((ticketRef : any)=>{

                        let ticket = data.assets.Ticket[ticketRef.id]
                        ticket.customer = ticket.customer_id ? data.assets.User[ticket.customer_id] : {}
                        ticket.organization = ticket.customer.organization_id ? data.assets.Organization[ticket.customer.organization_id] : {}

                        return (

                        <IonItem key={ticket.id} routerLink={"/ticket/"+ticket.id}>
                            <IonLabel>
                                <h2>{ticket.title}</h2>
                                <p>{ticket.customer.firstname} {ticket.customer.lastname} @ {ticket.organization.name}</p>
                            </IonLabel>
                            <IonNote slot={"end"}>{ticket.article_count}</IonNote>
                            {/* <IonCardContent>
                                Keep close to Nature's heart... and break clear away, once in awhile,
                                and climb a mountain or spend a week in the woods. Wash your spirit clean.
                            </IonCardContent> */}
                        </IonItem>
                    )
                    })}

                </IonList>
            </IonPage>

        );
    }
}


