import React, {Component} from "react";


export interface FormComponentState{
    record: any,
    clicked: []
}

export default class FormComponent<A,B extends FormComponentState> extends Component<A,B> {

    getResetState() {
        return {
            clicked: [],
            record: {}
        }
    }

    handleInputChange(name: string, value: any, record: Object) {
        // @ts-ignore
        record[name] = value;

        this.setState({
            record: this.state.record
        });
        console.log(this.state)
    }

    getProps(name: string, required: boolean, record: Object) {
        if (!record) record = this.state.record;
        if (name.includes(".")) {
            let parts = name.split(".");
            while (parts.length > 1) {
                // @ts-ignore
                record = record[parts.shift()];
            }
            name = parts.shift() as string;
        }


        return {
            // @ts-ignore
            value: record[name] === undefined ? "" : record[name],
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => this.handleInputChange(name, e.target.value, record),
            onIonChange: (e: any) => this.handleInputChange(name, e.detail.value, record),
            name: name,
            // @ts-ignore
            valid: (!required || record[name]) && (this.state.clicked.includes(name)),
            // @ts-ignore
            invalid: required && !record[name] && (this.state.clicked.includes(name) || this.state.submitAttempted),
            required,
            onClick: () => {
                // @ts-ignore
                this.state.clicked.includes(name) || this.state.clicked.push(name);
                // @ts-ignore
                this.setState({clicked: this.state.clicked})
            }
        }
    }
}