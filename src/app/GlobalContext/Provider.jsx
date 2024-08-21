'use client'
import { Provider } from "react-redux"
import Store from "./Store";
import { ReactNode } from "react"

const ReduxProvider= ({ children }) => {
    return <Provider store={Store}>{children}</Provider>;
};

export default ReduxProvider;