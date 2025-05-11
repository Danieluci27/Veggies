import { Modal, TextInput, View, StyleSheet, Image, Button } from "react-native";

const SaveModal = ({ isOpen, imageUrl, input, setInput}) => {
    if (isOpen) {
        return <Modal isVisible={isOpen}>
        <View style={styles.container}>
            <Image style={styles.image} source={{uri: imageUrl}}/>
            <TextInput style={styles.input} value={input} onChangeText={text => setInput(text)}/>
            <Button title="Hide modal" onPress={() => !isOpen} />
        </View>
        </Modal>
    }
};

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: 'bold', 
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
        borderRadius: 10,
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
});



export default SaveModal;
