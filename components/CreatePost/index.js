import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import {
  Content,
  Header,
  Container,
  Body,
  Text,
  Icon,
  Right,
  Left,
  Button,
  Item,
  Input
} from 'native-base';
import Api from '../../utils/api';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from 'react-native-image-resizer';

var options = {
  title: 'Selecciona una foto',
  takePhotoButtonTitle: 'Tomar una foto',
  chooseFromLibraryButtonTitle: 'Desde galería',
  cancelButtonTitle: 'Cancelar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

class CreatePost extends React.Component {
  state = {
    imageSource: null,
    title: '',
    showSpinner: false
  };

  pickImage = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        ImageResizer.createResizedImage('data:image/jpeg;base64,' + response.data, 400, 400, 'JPEG', 50).then((source) => {
          // response.uri es la URI de la nueva imagén que puede ser mostrada o subida...
          // response.path es la ruta de la nueva imagén
          // response.name es el nombre de la nueva imagén con su extensión
          // response.size es el tamaño de la nueva imagén
          this.setState({
            imageSource: {
              uri: source.uri,
              fileName: source.name
            }
          });
        }).catch((err) => {
          // Oops, algo salió mal. Revisa que el nombre del archivo sea correcto
          // e inspecciona la variable err para obtener más detalles.
          console.log('Resize error', err);
        });
      }
    });
  };

  uploadFile = () => {
    this.setState({ showSpinner: true });
    Api.postImage({
      photo: this.state.imageSource,
      title: this.state.title
    }).then(data => {
      this.setState({ showSpinner: false });
      this.props.navigation.goBack();
      console.log(data);
    });
  };

  render() {
    var { imageSource } = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text>Publicación</Text>
          </Body>
          <Right />
        </Header>
        <Content>
          <TouchableOpacity onPress={this.pickImage}>
            <Image
              source={
                imageSource
                  ? { uri: imageSource.uri }
                  : require('../../assets/placeholder-camera.png')
              }
              style={styles.uploadAvatar}
            />
          </TouchableOpacity>
          <Item rounded style={styles.comment}>
            <Input
              placeholder="Agrega un comentario"
              onChangeText={title => this.setState({ title })}
            />
          </Item>
          {imageSource &&
            <Button block info onPress={this.uploadFile}>
              <Text>Publicar</Text>
            </Button>
          }
          <Spinner
            visible={this.state.showSpinner}
            textContent={'Publicando...'}
            textStyle={{ color: '#FFF' }}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  uploadAvatar: {
    height: 200,
    flex: 1,
    width: null
  },
  comment: {
    marginTop: 10,
    marginBottom: 5
  }
});

export default CreatePost;
