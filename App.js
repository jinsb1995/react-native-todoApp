import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { styles, theme } from "./styles"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Platform
} from "react-native";


const STORAGE_KEY_TODOS = "@toDos";
const STORAGE_KEY_MODE = "@mode";

export default function App() {
    const [working, setWorking] = useState(true); // work, travel 구분
    const [text, setText] = useState(""); // 입력값 저장
    const [toDos, setToDos] = useState({});
    const [finished, setFinished] = useState(false);
    const [openEdit, setOpenEdit] = useState({key: "", status: false});

    const [editText, setEditText]= useState("");
    
    useEffect(() => {
        loadToDos();
        loadWorkingMode();
    }, []);

    useEffect(() => {
        saveWorkingMode();
    }, [working]);


    const travel = () => setWorking(false);
    const work = () => setWorking(true);


    const openEditInput = (key, status) => {
        setEditText(toDos[key].text)
        const newOpenEdit = {...openEdit};
        newOpenEdit.key = key
        newOpenEdit.status = status;
        setOpenEdit(newOpenEdit);
    }

    const closeEditInput = (key, status) => {
        const closeEdit = {...openEdit};
        if (openEdit.key === key) 
            closeEdit.status = status;
        
        setOpenEdit(closeEdit);
    }

    // 체크박스를 클릭하면 finished를 on/off시킨 후 toDos를 새롭게 저장한다.
    const isFinished = async (key) => {
        const newToDos = { ...toDos };
        
        const newFinished = !newToDos[key].finished;

        newToDos[key].finished = newFinished;

        setToDos(newToDos);
        await saveToDos(newToDos);
        setFinished(newFinished);
    }


    // 마지막에 지정한 working모드를 저장한다.
    const saveWorkingMode = async () => {
        await AsyncStorage.setItem(STORAGE_KEY_MODE, JSON.stringify(working));
    };

    // 디바이스에 저장되어있는 working모드를 불러온다.
    const loadWorkingMode = async () => {
        const mode = await AsyncStorage.getItem(STORAGE_KEY_MODE);
        setWorking(JSON.parse(mode));
    };

    // text를 받아서 state에 text를 담는다.
    const onChangeText = (payload) => {
        setText(payload);
    };
    const onChangeEditText = (payload) => {
        setEditText(payload);
    };

    // toDos에 저장된 할일 목록을 String으로 바꿔서 휴대폰 디바이스 내에 AsyncStorage에 저장한다.
    const saveToDos = async (toSave) => {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEY_TODOS,
                JSON.stringify(toSave),
            );
        } catch (error) {
            console.log(error);
        }
    };

    // 휴대폰 저장소에 저장된 데이터를 가져온다.
    const loadToDos = async () => {
        // await을 사용하면 error가 발생할 수 있기 떄문에 try/catcf 사용 권장
        try {
            const s = await AsyncStorage.getItem(STORAGE_KEY_TODOS);
            if (s) {
                setToDos(JSON.parse(s));
            }
        } catch (error) {
            // alert("데이터를 불러오던 중 에러가 발생했습니다.");
            setToDos({});
            console.log(error);
        }
    };

    // 디바이스에 toDo 내역을 저장한다.
    const addToDo = async () => {
        if (text === "") return;

        // 새로운 Object에 - 기존 Object를 담고, 새로운 Object를 담는다.
        const newToDos = {
            ...toDos,
            [Date.now()]: { text: text, working: working, finished: finished },
        };

        // 새로운 Object를 담아준다.
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText(""); // toDo에 value를 empty로 설정
    };

    const editToDo = async (key) => {
        if (editText === "") return;

        const newToDos = {...toDos}
        newToDos[key].text = editText;

        setToDos(newToDos);
        await saveToDos(newToDos);
        closeEditInput(key, false);
    }

    const deleteTodo = async (key) => {
        /*
            파라미터로 들어온 key가 없는 newToDos의 Object를 새로 만들어서 set해주어야 한다.
            alert의 버튼에 function을 줄 수 있다. 
            ReactNative에서 지원하는 API
        */
        if (Platform.OS === "web") {
            const ok = confirm("Do you want to delete this ToDo?");
            if (ok) {
                const newToDos = { ...toDos };
                delete newToDos[key];
                // state가 전달되면 ui가 업데이트된다. (rerender)
                setToDos(newToDos);
                await saveToDos(newToDos);
            }
        } else {
            Alert.alert("삭제", "정말로 삭제하시겠습니까?", [
                { text: "취소" },
                {
                    text: "삭제",
                    onPress: async () => {
                        const newToDos = { ...toDos };
                        delete newToDos[key];
                        // state가 전달되면 ui가 업데이트된다. (rerender)
                        setToDos(newToDos);
                        await saveToDos(newToDos);
                    },
                },
            ]);
        }
        
        return;
    };



    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            {/* header */}
            <View style={styles.header}>
                {/* 터치(press)하면 투명도가 낮아지는 기능 */}
                <TouchableOpacity onPress={work}>
                    <Text
                        style={{
                            fontSize: 38,
                            fontWeight: "600",
                            color: working ? "white" : theme.grey,
                        }}
                    >
                        Work
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={travel}>
                    <Text
                        style={{
                            fontSize: 38,
                            fontWeight: "600",
                            color: !working ? "white" : theme.grey,
                        }}
                    >
                        Travel
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                <TextInput
                    // keyboardType='phone-pad'
                    // returnKeyType='done'
                    //  secureTextEntry
                    // multiline
                    // autoCapitalize={'words'}
                    onSubmitEditing={addToDo} // 휴대폰 키보드에서 '완료'를 누르면 동작한다.
                    returnKeyType={"done"} // 휴대폰 키보드의 전송 및 완료 버튼을 변경한다.
                    onChangeText={onChangeText}
                    value={text}
                    placeholder={
                        working
                            // ? "할 일을 작성해주세요."
                            // : "어디로 여행가고싶은지 적어봐"
                            ? "해야할 일을 작성해주세요."
                            : "가고싶은 여행지를 작성해주세요."
                    }
                    style={styles.input}
                />
            </View>

            <ScrollView>
                {Object.keys(toDos).map((key) =>
                    toDos[key].working === working ? (
                        <View style={styles.toDo} key={key}>

                            { openEdit.key === key && openEdit.status ? (
                                <TextInput
                                    key={key}
                                    onSubmitEditing={() => editToDo(key)} // 휴대폰 키보드에서 '완료'를 누르면 동작한다.
                                    returnKeyType={"done"} // 휴대폰 키보드의 전송 및 완료 버튼을 변경한다.
                                    onChangeText={onChangeEditText}
                                    value={editText}
                                    placeholder={ working ? "해야할 일을 작성해주세요." : "가고싶은 여행지를 작성해주세요." }
                                    style={ styles.editInput }
                                />
                            ): (
                                <TouchableOpacity 
                                    onPress={() => isFinished(key)} 
                                    style={{ flex: 0.7, marginLeft: -20, paddingVertical: 5 }}
                                >
                                    <Text style={ !toDos[key].finished ? styles.toDoText : styles.toDoFinishedText }>
                                        {toDos[key].text}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: openEdit.status ? 'none' : 'flex' }}>
                                <TouchableOpacity style={{ display: toDos[key].finished ? "none" : "flex" }}>
                                    <AntDesign onPress={() => openEditInput(key, true)} style={{ marginRight: 20 }} name="edit" size={24} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => deleteTodo(key)}>
                                    <Fontisto name="trash" size={24} color={theme.grey} />
                                </TouchableOpacity>
                            </View>
                                <TouchableOpacity 
                                    style={{ display: openEdit.key === key && openEdit.status ? 'flex' : 'none', marginLeft: 15 }} 
                                    onPress={() => closeEditInput(key, false)}
                                >
                                    <Fontisto name="close" size={24} color="black" />
                                </TouchableOpacity>
                        </View>
                    ) : null,
                )}
            </ScrollView>
        </View>
    );
}