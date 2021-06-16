import {Component} from "react";
import {IonPage, IonContent, IonSpinner} from "@ionic/react";

export default class Loading extends Component{
    render() {
        return (
            <IonPage>
                <IonContent style={{"text-align":"center"}}>
                    <IonSpinner style={{"padding-top":"100%"}} />
                </IonContent>
            </IonPage>
        )
    }
}