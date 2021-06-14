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
    IonButton, IonFooter,
    IonButtons, IonMenuButton, IonBackButton, IonGrid, IonRow, IonCol, IonInput, IonToast
} from '@ionic/react';

import {arrowBack, shapesOutline} from "ionicons/icons";
import apiHandler, {api} from "./api";
import storage from "./storage";
import FormComponent, {FormComponentState} from "./FormComponent";

interface ComponentState extends FormComponentState{
    record: {
        url: string,
        username: string,
        password: string
    },
    error?: string
}

interface ComponentProps {
}

export default class Menu extends FormComponent<ComponentProps, ComponentState> {

    constructor(props: any) {
        super(props)
        this.state = {

            record: {
                url: "",
                username: "",
                password: ""
            },
            clicked: []
        }
    }


    async componentDidMount() {

    }

    componentDidUpdate(prevProps: Readonly<ComponentProps>, prevState: Readonly<ComponentState>, snapshot?: any) {
    }

    componentWillUnmount() {

    }

    async login() {

        try{
            api.defaults.baseURL = this.state.record.url + "/api/v1/"
            api.defaults.headers['Authorization'] = `Basic ${btoa(this.state.record.username+":"+this.state.record.password)}`;

            let {permissions, tokens} = (await apiHandler.getApiTokens()).data;

            let token = await apiHandler.createApiToken({
                label: "app_login",
                permission: permissions.map((p : any)=>p.name),
            })

            storage.set('url', this.state.record.url);
            storage.set('token', btoa(token.data.name));

        }catch(e){
            console.error(e)
            this.setState({error:e.message})
        }
        // First API request to get API Keys
        // Then let's create a key
        // Finally store it

    }

    render() {

        // eslint-disable-next-line react-hooks/rules-of-hooks

        return (

            <IonPage>
                <IonHeader>


                <IonToolbar>

                    <IonButtons slot="start">
                        <IonBackButton icon={arrowBack} text="" className="custom-back"/>
                    </IonButtons>
                    <IonTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" height={24}width={35}>

                            <path d="M12.574 15.55L.721 19.88l16.448-1.934z" fill="#D9B42F"/>
                            <path d="M12.574 15.55l1.565 3.653-10.644-5.048z" fill="#FFE188"/>
                            <path d="M27.515 7.428l-1.206 1.89 2.513-2.412zM20.67 7.731l2.156.935 3.49-.84-.008-.386z"
                                  fill="#E83F00"/>
                            <path
                                d="M28.599 6.098l-1.985 1.16-1.203.86-.705 3.444.584-.29zM26.308 7.44L19.89 9.077l2.8.582z"
                                fill="#CD2015"/>
                            <path d="M23.026 15.596l2.255-4.303 1.332-4.036-14.039 8.293 4.529.622z" fill="#EA4F86"/>
                            <path d="M12.575 15.55l2.59-1.395 1.353-10.307z" fill="#00A2C9"/>
                            <path d="M16.518 3.848L10.419-.066l6.248 7.06z" fill="#00A2C9"/>
                            <path d="M16.607 5.655l-7.35-2.268 7.44 4.791z" fill="#5A8794"/>
                            <path d="M16.607 5.655l-6.894 3.4 6.984-.877z" fill="#005971"/>
                            <path d="M16.518 3.848L14.83 14.566l2.883-1.836-1.047-8.6z" fill="#5EB2D1"/>
                            <path d="M22.58 9.638l1.188 4.549-.742 1.41-2.596-4.688z" fill="#F59B00"/>
                            <path d="M15.867 15.356l-1.728 3.847 8.887-3.607z" fill="#E83F00"/>
                            <path d="M16.518 3.848l.585 12.324 5.923-.576z" fill="#BAE2F5"/>
                            <path d="M16.95 12.975l.153 3.198-6.182 2.176 1.653-2.799z" fill="#F59B00"/>
                            <path d="M17.103 16.173l-2.964 3.03L.028 24.91l12.546-9.359z" fill="#FFD130"/>
                        </svg> Login
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
                <IonContent fullscreen>
                    <IonGrid className="ion-padding">
                        <IonRow>
                            <IonCol size="12">
                                <h5>Please login with your zammad instance credentials below</h5>
                            </IonCol>
                        </IonRow>

                        <IonRow className="ion-margin-top ion-padding-top">
                            <IonCol size="12">

                                <IonList>
                                    <IonItem>
                                        <IonLabel>URL</IonLabel>
                                        {/*
                                         //@ts-ignore */}
                                        <IonInput {...this.getProps("url")}></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Username</IonLabel>
                                        {/*
                                         //@ts-ignore */}
                                        <IonInput {...this.getProps("username")}></IonInput>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Password</IonLabel>
                                        {/*
                                         //@ts-ignore */}
                                        <IonInput {...this.getProps("password")}></IonInput>
                                    </IonItem>
                                </IonList>

                                <IonButton expand="full" onClick={this.login.bind(this)}>Login</IonButton>

                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonToast
                        isOpen={!!this.state.error}
                        message={this.state.error}
                        position="top"
                    />
                </IonContent>

                <IonFooter>
                    <IonGrid className="ion-no-margin ion-no-padding">

                        <IonRow className="ion-text-center ion-justify-content-center">
                            <IonCol size="12">
                                <p>
                                    Zammad Logo Copyright © 2021 Zammad
                                </p>
                            </IonCol>
                        </IonRow>
                        <svg style={{marginBottom: "-0.5rem"}} xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 1440 320">
                            <path fill="#7a506f" fill-opacity="1"
                                  d="M0,288L40,277.3C80,267,160,245,240,224C320,203,400,181,480,176C560,171,640,181,720,181.3C800,181,880,171,960,144C1040,117,1120,75,1200,58.7C1280,43,1360,53,1400,58.7L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
                        </svg>

                    </IonGrid>
                </IonFooter>
            </IonPage>

        );
    }
}


