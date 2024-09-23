import React from 'react'
import { ActivityIndicator, Platform, StyleSheet, StatusBar, View, ScrollView, Text, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TextInput, Keyboard, SafeAreaView, Linking, Image } from 'react-native'
import { AppContext, Icon, KeyboardShift, Spacer } from 'app-module'
import { UsersRoutes, RidersRoutes, DriversRoutes, SettingsRoutes } from 'app-routes'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import ImagePicker from 'react-native-image-crop-picker'
import OneSignal from 'react-native-onesignal'

const { width, height } = Dimensions.get("window")

export default class SignUp extends React.Component {
    static contextType = AppContext

    state = {
        height: height,
        secureTextEntry1: true,
        secureTextEntryIcon1: 'eye',
        showSecureTextEntryIcon1: false,
        secureTextEntry2: true,
        secureTextEntryIcon2: 'eye',
        showSecureTextEntryIcon2: false,
        isDriver: false,
        idLicense: { uri: '', data: '' },
        driverLicense: { uri: '', data: '' },
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        confirmPass: '',
        idLicenseError: false,
        driverLicenseError: false,
        firstNameError: false,
        lastNameError: false,
        phoneNumberError: false,
        passwordError: false,
        confirmPassError: false,
        formValid: false,
        formOpacity: 1,
        hasActivity: false
    }

    initConst = async () => {
        this.setState({ height: Platform.OS === 'ios' ? Dimensions.get('screen').height : parseFloat(await AsyncStorage.getItem('WINDOW_HEIGHT')) })
    }

    async componentDidMount() {
        await this.initConst()
        if (this.context.theme === 'light') StatusBar.setBarStyle('dark-content')
    }

    goBack = () => {
        if (this.context.theme === 'light') StatusBar.setBarStyle('light-content')
        this.props.navigation.goBack()
    }

    showToast = (message) => {
        Toast.show({
            type: 'info',
            text1: message,
            visibilityTime: 3000
        })
    }

    securePassword = (type) => {
        if (type === 'password') {
            this.setState({ secureTextEntry1: this.state.secureTextEntry1 ? false : true, secureTextEntryIcon1: this.state.secureTextEntry1 ? 'eye-off' : 'eye' })
        } else if (type === 'confirmPass') {
            this.setState({ secureTextEntry2: this.state.secureTextEntry2 ? false : true, secureTextEntryIcon2: this.state.secureTextEntry2 ? 'eye-off' : 'eye' })
        }
    }

    onBlur(type) {
        this.validateInput(type)
        if (type === 'password') {
            this.setState({ showSecureTextEntryIcon1: false, secureTextEntry1: true, secureTextEntryIcon1: 'eye' })
        } else if (type === 'confirmPass') {
            this.setState({ showSecureTextEntryIcon2: false, secureTextEntry2: true, secureTextEntryIcon2: 'eye' })
        }
    }

    onFocus(type) {
        if (type === 'password') {
            this.setState({ showSecureTextEntryIcon1: true })
        } else if (type === 'confirmPass') {
            this.setState({ showSecureTextEntryIcon2: true })
        }
    }

    checkValidation(type, cred) {
        this.setState({ [type]: cred }, () => {
            if (type === 'firstName') {
                if (this.state.firstName.length > 0) {
                    this.setState({ firstNameError: false })
                }
            } else if (type === 'lastName') {
                if (this.state.lastName.length > 0) {
                    this.setState({ lastNameError: false })
                }
            } else if (type === 'phoneNumber') {
                if (this.state.phoneNumber.length > 8) {
                    this.setState({ phoneNumberError: false })
                }
            } else if (type === 'password') {
                if (this.state.password.length > 5) {
                    this.setState({ passwordError: false, secureTextEntry1: true, secureTextEntryIcon1: 'eye' })
                }
            } else if (type === 'confirmPass') {
                if (this.state.confirmPass === this.state.password) {
                    this.setState({ confirmPassError: false, secureTextEntry2: true, secureTextEntryIcon2: 'eye' })
                }
            }
        })
    }

    validateInput(type) {
        return new Promise((resolve) => {

            if (type === 'firstName') {
                if (this.state.firstName.length < 1) {
                    this.setState({ firstNameError: true })
                } else if (this.state.firstName.length > 0) {
                    this.setState({ firstNameError: false })
                }
            } else if (type === 'lastName') {
                if (this.state.lastName.length < 1) {
                    this.setState({ lastNameError: true })
                } else if (this.state.lastName.length > 0) {
                    this.setState({ lastNameError: false })
                }
            } else if (type === 'phoneNumber') {
                if (this.state.phoneNumber.length < 9) {
                    this.setState({ phoneNumberError: true })
                } else if (this.state.phoneNumber.length > 8) {
                    this.setState({ phoneNumberError: false })
                }
            } else if (type === 'password') {
                if (this.state.password.length < 6) {
                    this.setState({ passwordError: true })
                } else if (this.state.password.length > 5) {
                    this.setState({ passwordError: false })
                }

                if (this.state.confirmPass && (this.state.confirmPass !== this.state.password)) {
                    this.setState({ confirmPassError: true })
                } else if (this.state.confirmPass === this.state.password) {
                    this.setState({ confirmPassError: false })
                }
            } else if (type === 'confirmPass') {
                if (this.state.confirmPass !== this.state.password) {
                    this.setState({ confirmPassError: true })
                } else if (this.state.confirmPass === this.state.password) {
                    this.setState({ confirmPassError: false })
                }
            } else if (type === 'idLicense') {
                if (this.state.idLicense.uri.length < 1) {
                    this.setState({ idLicenseError: true })
                } else if (this.state.idLicense.uri.length > 0) {
                    this.setState({ idLicenseError: false })
                }
            } else if (type === 'driverLicense') {
                if (this.state.driverLicense.uri.length < 1) {
                    this.setState({ driverLicenseError: true })
                } else if (this.state.driverLicense.uri.length > 0) {
                    this.setState({ driverLicenseError: false })
                }
            }

            if (this.state.isDriver) {
                if ((this.state.confirmPass === this.state.password && (this.state.password.length > 5)) && (this.state.firstName.length > 0) && (this.state.lastName.length > 0) && (this.state.idLicense.uri.length > 0) && (this.state.driverLicense.uri.length > 0) && (this.state.phoneNumber.length > 8)) {
                    this.setState({ formValid: true })
                } else {
                    this.setState({ formValid: false })
                }
            } else if (!this.state.isDriver) {
                if ((this.state.confirmPass === this.state.password && (this.state.password.length > 5)) && (this.state.firstName.length > 0) && (this.state.lastName.length > 0) && (this.state.phoneNumber.length > 8)) {
                    this.setState({ formValid: true })
                } else {
                    this.setState({ formValid: false })
                }
            }

            resolve('done')
        })
    }

    choosePhoto = (type) => {
        ImagePicker.openPicker({ cropping: false, writeTempFile: false, mediaType: 'photo', includeBase64: true }).then((image) => {
            const sizeLimit = Platform.OS === 'ios' ? 4.2 : 8
            if ((Math.floor((image.size / (1024 * 1024)) * 10) / 10) > sizeLimit) {
                this.setState({ [type + 'Error']: true })
            } else {
                var filename = image.path.replace(/^.*[\\\/]/, '')
                const data = new FormData()
                data.append('file', {
                    uri: image.path,
                    type: image.mime,
                    name: filename
                })

                this.setState({ [type]: { uri: image.path, data: data } })
            }
        }).catch((err) => console.log('[SignUp] openPicker:', err))
    }

    submit = async () => {
        await this.validateInput('firstName')
        await this.validateInput('lastName')
        await this.validateInput('phoneNumber')
        await this.validateInput('password')
        await this.validateInput('confirmPass')

        if (this.state.isDriver) {
            await this.validateInput('idLicense')
            await this.validateInput('driverLicense')
        }

        if (this.state.formValid) {
            Keyboard.dismiss()
            this.setState({ formOpacity: 0.2, hasActivity: true })
            UsersRoutes.signUp(this.state.firstName, this.state.lastName, '994' + this.state.phoneNumber, this.state.password, this.state.isDriver ? 2 : 1)
                .then(async (data) => {
                    if (!data.error) {
                        const deviceState = await OneSignal.getDeviceState()
                        SettingsRoutes.setDeviceId(deviceState.userId)

                        if (this.state.isDriver) {
                            // this.props.navigation.navigate('Auth', { screen: 'Verify', params: { directedFrom: 'SignUp', isDriver: this.state.isDriver } })
                            const userId = await AsyncStorage.getItem('USER_ID')
                            DriversRoutes.signUpDriver(userId).then(() => {
                                DriversRoutes.uploadDoc(this.state.idLicense.data).then((data) => {
                                    DriversRoutes.insertDoc(1, data.file_name).then(() => {
                                        DriversRoutes.uploadDoc(this.state.driverLicense.data).then((data) => {
                                            DriversRoutes.insertDoc(2, data.file_name).then(() => {
                                                UsersRoutes.authUser('994' + this.state.phoneNumber).then(async () => {
                                                    this.setState({ formOpacity: 1, hasActivity: false })
                                                    this.props.navigation.goBack()
                                                    this.props.navigation.navigate('Auth', { screen: 'SignIn' })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        } else {
                            const userId = await AsyncStorage.getItem('USER_ID')
                            RidersRoutes.signUpRider(userId).then(() => {
                                UsersRoutes.authUser('994' + this.state.phoneNumber).then(async () => {
                                    this.setState({ formOpacity: 1, hasActivity: false })
                                    await AsyncStorage.setItem('LOGGED', 'User')
                                    this.props.navigation.replace('User', { screen: 'UserHome' })
                                })
                            })
                        }
                    } else if (data.error) {
                        this.showToast(data.message)
                        this.setState({ phoneNumberError: true, formOpacity: 1, hasActivity: false })
                    }
                })
                .catch((err) => {
                    this.setState({ formOpacity: 1, hasActivity: false })
                })
        }
    }

    render() {
        const { colors, tint } = this.context

        const styles = StyleSheet.create({
            pageView: {
                backgroundColor: colors.primarySystemBackground,
                width: width,
                justifyContent: 'center'
            },
            backButton: {
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: 30,
                height: 30,
                position: 'absolute',
                top: StatusBar.currentHeight + 10,
                left: 11
            },
            pageGreetingView: {
                marginTop: 60,
                alignItems: 'center',
                justifyContent: 'center'
            },
            pageGreetingText: {
                fontSize: 28,
                fontWeight: '700',
                color: colors.primaryLabel
            },
            pageInputScroll: {
                width
            },
            pageFormView: {
                width,
                justifyContent: 'center'
            },
            pageInputView: {
                borderWidth: 0.5,
                borderColor: colors.nonopaqueSeparator,
                borderRadius: 14,
                backgroundColor: colors.secondarySystemBackground,
                marginHorizontal: 20,
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center'
            },
            inputIcon: {
                marginLeft: 20,
                height: 20,
                width: 20
            },
            pageTextInput: {
                flex: 1,
                marginLeft: 20,
                height: 44,
                fontSize: 17,
                color: colors.primaryLabel,
                paddingVertical: 7
            },
            pagePasswordSecureIconView: {
                position: 'absolute',
                right: 20,
                height: 20,
                width: 20
            },
            errorIconBackground: {
                height: 15,
                width: 15,
                borderRadius: 8,
                backgroundColor: colors.white,
                position: 'absolute'
            },
            checkView: {
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: 20
            },
            checkOptionView: {
                flexDirection: 'row',
                alignItems: 'center'
            },
            checkIconView: {
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1,
                marginRight: 10,
                borderColor: colors.nonopaqueSeparator,
                justifyContent: 'center',
                alignItems: 'center'
            },
            checkOptionLabel: {
                fontSize: 17,
                color: colors.primaryLabel,
                marginLeft: 5
            },
            filesView: {
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: 20
            },
            fileOptionView: {
                alignItems: 'center'
            },
            fileView: {
                width: 80,
                height: 57,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.nonopaqueSeparator,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            },
            fileImage: {
                width: 80,
                height: 57,
                borderRadius: 10
            },
            fileViewPlaceholder: {
                color: colors.tertiaryLabel,
                fontSize: 14,
                fontWeight: '700',
                textAlign: 'center'
            },
            fileUploadButton: {
                padding: 10
            },
            fileUploadButtonLabel: {
                color: colors[tint],
                fontSize: 15
            },
            pageTermsText: {
                color: colors[tint],
                fontSize: 13,
                textAlign: 'center',
                marginHorizontal: 20,
            },
            pageSubmitButton: {
                backgroundColor: colors[tint],
                marginBottom: 80,
                width: width - 80,
                height: 44,
                borderRadius: 14,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center'
            }
        })

        return (
            <KeyboardShift>
                {() => (
                    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primarySystemBackground }}>
                        <View style={[styles.pageView, { height: this.state.height }]}>
                            <ScrollView
                                horizontal={false}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps='always'
                                style={{ height: this.state.height }}
                            >
                                <View style={styles.pageGreetingView}>
                                    <Text style={styles.pageGreetingText}>Qeydiyyat</Text>
                                </View>

                                <Spacer height={50} />
                                <View style={styles.pageFormView}>
                                    <View style={{ opacity: this.state.formOpacity }}>
                                        <View style={[styles.pageInputView, { marginTop: 0 }]}>
                                            <View style={styles.inputIcon}>
                                                <Icon name={'person-outline'} size={20} style={{ color: colors.systemGray2 }} />
                                            </View>
                                            <TextInput
                                                onBlur={() => this.onBlur('firstName')}
                                                onChangeText={firstName => this.checkValidation('firstName', firstName)}
                                                onSubmitEditing={() => this.secondInput.focus()}
                                                blurOnSubmit={false}
                                                style={styles.pageTextInput}
                                                editable={!this.state.hasActivity}
                                                placeholderTextColor={colors.tertiaryLabel}
                                                autoComplete='off'
                                                autoCapitalize='words'
                                                returnKeyType='next'
                                                keyboardType='default'
                                                textContentType='name'
                                                placeholder='Ad'
                                                selectionColor={colors.secondaryLabel}
                                                value={this.state.firstName}
                                            />
                                            {this.state.firstNameError && <View style={styles.pagePasswordSecureIconView} >
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => this.showToast('Ad tÉ™lÉ™b olunur')}>
                                                    <Icon name={'alert-circle-outline'} size={20} style={{ color: colors.systemRed }} />
                                                </TouchableOpacity>
                                            </View>}
                                        </View>

                                        <View style={styles.pageInputView}>
                                            <View style={styles.inputIcon}>
                                                <Icon name={'person-outline'} size={20} style={{ color: colors.systemGray2 }} />
                                            </View>
                                            <TextInput
                                                ref={ref => { this.secondInput = ref }}
                                                onBlur={() => this.onBlur('lastName')}
                                                onChangeText={lastName => this.checkValidation('lastName', lastName)}
                                                onSubmitEditing={() => this.thirdInput.focus()}
                                                blurOnSubmit={false}
                                                style={styles.pageTextInput}
                                                editable={!this.state.hasActivity}
                                                placeholderTextColor={colors.tertiaryLabel}
                                                autoComplete='off'
                                                autoCapitalize='words'
                                                returnKeyType='next'
                                                keyboardType='default'
                                                textContentType='familyName'
                                                placeholder='Soyad'
                                                selectionColor={colors.secondaryLabel}
                                                value={this.state.lastName}
                                            />
                                            {this.state.lastNameError && <View style={styles.pagePasswordSecureIconView} >
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => this.showToast('Soyad tÉ™lÉ™b olunur')}>
                                                    <Icon name={'alert-circle-outline'} size={20} style={{ color: colors.systemRed }} />
                                                </TouchableOpacity>
                                            </View>}
                                        </View>

                                        <View style={styles.pageInputView}>
                                            <View style={styles.inputIcon}>
                                                <Icon name={'call-outline'} size={20} style={{ color: colors.systemGray2 }} />
                                            </View>
                                            <Text style={{ fontSize: 17, color: colors.primaryLabel, marginLeft: 20 }}>+994</Text>
                                            <TextInput
                                                ref={ref => { this.thirdInput = ref }}
                                                onBlur={() => this.onBlur('phoneNumber')}
                                                onChangeText={phoneNumber => this.checkValidation('phoneNumber', phoneNumber)}
                                                onSubmitEditing={() => this.fourthInput.focus()}
                                                blurOnSubmit={false}
                                                style={[styles.pageTextInput, { marginLeft: 10 }]}
                                                editable={!this.state.hasActivity}
                                                placeholderTextColor={colors.tertiaryLabel}
                                                autoComplete='off'
                                                autoCapitalize='none'
                                                returnKeyType='next'
                                                keyboardType='phone-pad'
                                                textContentType='telephoneNumber'
                                                placeholder='-- --- ----'
                                                maxLength={9}
                                                selectionColor={colors.secondaryLabel}
                                                value={this.state.phoneNumber}
                                            />
                                            {this.state.phoneNumberError && <View style={styles.pagePasswordSecureIconView} >
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => this.showToast('Telefon nÃ¶mrÉ™si yanlÄ±ÅŸdÄ±r')}>
                                                    <Icon name={'alert-circle-outline'} size={20} style={{ color: colors.systemRed }} />
                                                </TouchableOpacity>
                                            </View>}
                                        </View>

                                        <View style={styles.pageInputView}>
                                            <View style={styles.inputIcon}>
                                                <Icon name={'lock-closed-outline'} size={20} style={{ color: colors.systemGray2 }} />
                                            </View>
                                            <TextInput
                                                ref={ref => { this.fourthInput = ref }}
                                                onBlur={() => this.onBlur('password')}
                                                onFocus={() => this.onFocus('password')}
                                                onChangeText={password => this.checkValidation('password', password)}
                                                onSubmitEditing={() => this.fifthInput.focus()}
                                                style={styles.pageTextInput}
                                                editable={!this.state.hasActivity}
                                                placeholderTextColor={colors.tertiaryLabel}
                                                secureTextEntry={this.state.secureTextEntry1}
                                                autoComplete='off'
                                                autoCapitalize='none'
                                                returnKeyType='next'
                                                textContentType='newPassword'
                                                placeholder='ÅžifrÉ™'
                                                selectionColor={colors.secondaryLabel}
                                                value={this.state.password}

                                            />
                                            {this.state.showSecureTextEntryIcon1 && <TouchableWithoutFeedback onPress={() => this.securePassword('password')}>
                                                <View style={styles.pagePasswordSecureIconView} >
                                                    <Icon name={this.state.secureTextEntryIcon1} size={20} style={{ color: colors.tertiaryLabel }} />
                                                </View>
                                            </TouchableWithoutFeedback>}
                                            {(!this.state.showSecureTextEntryIcon1 && this.state.passwordError) && <View style={styles.pagePasswordSecureIconView} >
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => this.showToast('ÅžifrÉ™dÉ™ É™n azÄ± 6 simvol olmalÄ±dÄ±r')}>
                                                    <Icon name={'alert-circle-outline'} size={20} style={{ color: colors.systemRed }} />
                                                </TouchableOpacity>
                                            </View>}
                                        </View>

                                        <View style={styles.pageInputView}>
                                            <View style={styles.inputIcon}>
                                                <Icon name={'lock-closed-outline'} size={20} style={{ color: colors.systemGray2 }} />
                                            </View>
                                            <TextInput
                                                ref={ref => { this.fifthInput = ref }}
                                                onBlur={() => this.onBlur('confirmPass')}
                                                onFocus={() => this.onFocus('confirmPass')}
                                                onChangeText={confirmPass => this.checkValidation('confirmPass', confirmPass)}
                                                onSubmitEditing={() => this.submit()}
                                                style={styles.pageTextInput}
                                                editable={!this.state.hasActivity}
                                                placeholderTextColor={colors.tertiaryLabel}
                                                secureTextEntry={this.state.secureTextEntry2}
                                                autoComplete='off'
                                                autoCapitalize='none'
                                                returnKeyType='go'
                                                textContentType='newPassword'
                                                placeholder='TÉ™krar ÅŸifrÉ™'
                                                selectionColor={colors.secondaryLabel}
                                                value={this.state.confirmPass}

                                            />
                                            {this.state.showSecureTextEntryIcon2 && <TouchableWithoutFeedback onPress={() => this.securePassword('confirmPass')}>
                                                <View style={styles.pagePasswordSecureIconView} >
                                                    <Icon name={this.state.secureTextEntryIcon2} size={20} style={{ color: colors.tertiaryLabel }} />
                                                </View>
                                            </TouchableWithoutFeedback>}
                                            {(!this.state.showSecureTextEntryIcon2 && this.state.confirmPassError) && <View style={styles.pagePasswordSecureIconView} >
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => this.showToast('ÅžifrÉ™lÉ™r eyni deyil')}>
                                                    <Icon name={'alert-circle-outline'} size={20} style={{ color: colors.systemRed }} />
                                                </TouchableOpacity>
                                            </View>}
                                        </View>
                                    </View>
                                    <View style={{ alignSelf: 'center', position: 'absolute' }}>
                                        <ActivityIndicator size='large' color={colors.systemGray1} animating={this.state.hasActivity} />
                                    </View>
                                </View>

                                <Spacer height={20} />
                                <View style={styles.checkView}>
                                    <View style={styles.checkOptionView}>
                                        <TouchableOpacity style={styles.checkIconView} activeOpacity={0.6} onPress={() => this.setState({ isDriver: false })}>
                                            {!this.state.isDriver && <Icon name={'ellipse'} size={16} style={{ color: colors[tint] }} />}
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.6} onPress={() => this.setState({ isDriver: false })} style={styles.checkOptionView}>
                                            <Icon name={'person'} size={20} style={{ color: colors.primaryLabel }} />
                                            <Text style={styles.checkOptionLabel}>SÉ™rniÅŸin</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.checkOptionView}>
                                        <TouchableOpacity style={styles.checkIconView} activeOpacity={0.6} onPress={() => this.setState({ isDriver: true })}>
                                            {this.state.isDriver && <Icon name={'ellipse'} size={16} style={{ color: colors[tint] }} />}
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.6} onPress={() => this.setState({ isDriver: true })} style={styles.checkOptionView}>
                                            <Icon name={'car-sport'} size={23} style={{ color: colors.primaryLabel }} />
                                            <Text style={styles.checkOptionLabel}>SÃ¼rÃ¼cÃ¼</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {this.state.isDriver && <>
                                    <Spacer height={20} />
                                    <View style={styles.filesView}>
                                        <View style={styles.fileOptionView}>
                                            <View style={styles.fileView}>
                                                {this.state.idLicense.uri
                                                    ? <Image source={{ uri: this.state.idLicense?.uri }} style={styles.fileImage} />
                                                    : this.state.idLicenseError
                                                        ? <Icon name={'alert-circle-outline'} size={20} style={{ color: colors.systemRed }} />
                                                        : <Text style={styles.fileViewPlaceholder}>ÅžÉ™xsiyyÉ™t vÉ™siqÉ™si</Text>
                                                }
                                            </View>
                                            <TouchableOpacity activeOpacity={0.6} onPress={() => this.choosePhoto('idLicense')} style={styles.fileUploadButton}>
                                                <Text style={styles.fileUploadButtonLabel}>{this.state.idLicense.uri ? 'DÉ™yiÅŸ' : 'YÃ¼klÉ™'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.fileOptionView}>
                                            <View style={styles.fileView}>
                                                {this.state.driverLicense.uri
                                                    ? <Image source={{ uri: this.state.driverLicense?.uri }} style={styles.fileImage} />
                                                    : this.state.driverLicenseError
                                                        ? <Icon name={'alert-circle-outline'} size={20} style={{ color: colors.systemRed }} />
                                                        : <Text style={styles.fileViewPlaceholder}>SÃ¼rÃ¼cÃ¼lÃ¼k vÉ™siqÉ™si</Text>
                                                }
                                            </View>
                                            <TouchableOpacity activeOpacity={0.6} onPress={() => this.choosePhoto('driverLicense')} style={styles.fileUploadButton}>
                                                <Text style={styles.fileUploadButtonLabel}>{this.state.driverLicense.uri ? 'DÉ™yiÅŸ' : 'YÃ¼klÉ™'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>}

                                <Spacer height={40} />
                                <View>
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => { Linking.openURL('http://golddriver.az/privacypolicy') }} >
                                    <Text style={styles.pageTermsText}>XidmÉ™tdÉ™n istifadÉ™ edÉ™rkÉ™n qaydalar vÉ™ ÅŸÉ™rtlÉ™rnÉ™n razÄ±laÅŸmÄ±ÅŸ olursunuz</Text>
                                    </TouchableOpacity>
                                </View>

                                <Spacer height={30} />
                                <TouchableOpacity activeOpacity={0.6} disabled={this.state.hasActivity} style={styles.pageSubmitButton} onPress={() => this.submit()} >
                                    <Text style={{ color: colors.white, fontWeight: '600', fontSize: 17 }}>Qeydiyyat</Text>
                                </TouchableOpacity>
                            </ScrollView>

                            <TouchableOpacity activeOpacity={0.6} style={styles.backButton} onPress={() => this.goBack()} >
                                <Icon name={'chevron-back'} size={30} style={{ color: colors[tint] }} />
                            </TouchableOpacity>

                        </View>
                    </SafeAreaView>
                )}
            </KeyboardShift>
        )
    }
}