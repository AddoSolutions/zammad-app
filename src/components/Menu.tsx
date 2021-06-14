import React, {Component} from "react";
import ReactDOM from "react-dom";
import { menuController } from "@ionic/core";


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
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  add, addOutline,
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  heartOutline,
  heartSharp, listOutline,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp
} from 'ionicons/icons';
import './Menu.css';
import api from "../api";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'New Ticket',
    url: '/page/new',
    iosIcon: add,
    mdIcon: add
  },
];


interface MenuState {
  overviews: any[]; //replace any with suitable type
  date: Date;
}

export default class Menu extends Component<{}, MenuState> {

  constructor(props : any) {
    super(props)
    this.state = {
      date: new Date(),
      overviews: []
    }
  }

  async reloadList() {

    let overviews = (await api.getOverviews()).data
    console.log(overviews);
    this.setState({overviews});
  }

  async componentDidMount() {
    await this.reloadList();

  }

  componentWillUnmount() {

  }

  render() {

    // eslint-disable-next-line react-hooks/rules-of-hooks


    return (
        <IonMenu contentId="main" type="overlay">
          <IonContent>
            <IonList id="inbox-list">
              {/*
              //@ts-ignore */}
              <IonListHeader>{api.getMe().firstname} {api.getMe().lastname}</IonListHeader>
              {/*
              //@ts-ignore */}
              <IonNote>{api.getMe().email}</IonNote>
              {appPages.map((appPage, index) => {
                return (
                    <IonMenuToggle key={index} autoHide={false}>
                      <IonItem routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                        <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                        <IonLabel>{appPage.title}</IonLabel>
                      </IonItem>
                    </IonMenuToggle>
                );
              })}
            </IonList>

            <IonList id="labels-list">
              <IonListHeader>Labels</IonListHeader>
              {this.state.overviews.map((overview: any) => (
                  <IonItem routerLink={"/overview/"+overview.link} onClick={()=>menuController.close()} lines="none" key={overview.link}>
                    <IonIcon slot="start" icon={listOutline} />
                    <IonLabel>{overview.name}</IonLabel>
                  </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonMenu>
    );
  }
}


