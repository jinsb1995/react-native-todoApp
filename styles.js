import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const theme = {
    bg: "black",
    grey: "#3A3D40",
    toDoBg: "#5C5C60",
    white: 'white',
}


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000',
        backgroundColor: theme.bg,
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100,
    },
    btnText: {

    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 10,
        fontSize: 18,
    },
    editInput: {
        backgroundColor: "white",
        paddingVertical: 10,
        flex: 1,
        paddingLeft: 10,
        marginLeft: -25,
        borderRadius: 10,
        fontSize: 18,
        // textAlign: "left",
    },
    toDo: {
        backgroundColor: theme.toDoBg,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    toDoText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    toDoFinishedText: {
        textDecorationLine: "line-through",
        color: "grey",
        fontSize: 16,
        fontWeight: "500",
    }
});
