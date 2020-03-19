import React, { useReducer, useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { QuestResults } from './types';
import { useScrollToTop } from '@react-navigation/native';
import { useDebounce } from '../../hooks/use-debounce';

const initialState = {
  symptoms: new Map(),
  travel: undefined,
  confirmedContact: undefined,
  suspectedContact: undefined,
  age: undefined,
  pregnant: undefined,
  outOfBreath: undefined,
  newBorn: undefined,
  illness: new Map(),
};

function reducer(state, newState) {
  return { ...state, ...newState };
}

function QuestButton({ id, text, onPress, selected }) {
  const isSelected = !!selected.get(id);

  const handlePress = () => {
    onPress(id);
  };

  return (
    <RectButton
      style={[styles.button, isSelected && styles.activeButton]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, isSelected && styles.activeButtonText]}>
        {text}
      </Text>
    </RectButton>
  );
}

function YesNoButtons({ id, onPress, state }) {
  const isYes = state[id] === 'yes';
  const isNo = state[id] === 'no';

  const handleYesPress = () => {
    onPress({ [id]: 'yes' });
  };
  const handleNoPress = () => {
    onPress({ [id]: 'no' });
  };
  return (
    <>
      <RectButton
        style={[styles.button, isYes && styles.activeButton]}
        onPress={handleYesPress}
      >
        <Text style={[styles.buttonText, isYes && styles.activeButtonText]}>
          Si
        </Text>
      </RectButton>
      <RectButton
        style={[styles.button, isNo && styles.activeButton]}
        onPress={handleNoPress}
      >
        <Text style={[styles.buttonText, isNo && styles.activeButtonText]}>
          No
        </Text>
      </RectButton>
    </>
  );
}

interface QuestionaryProps {
  onShowResults: (value: QuestResults) => void;
}

function Questionary({ onShowResults }: QuestionaryProps) {
  const [state, setState] = useReducer(reducer, initialState);
  const [disabled, setDisabled] = useState(true);
  const [showAge, setShowAge] = useState(false);

  const onSelectSymptoms = useCallback(
    id => {
      const newSelected = new Map(state.symptoms);
      newSelected.set(id, !state.symptoms.get(id));

      setState({ symptoms: newSelected });
    },
    [state.symptoms],
  );

  const onSelectIllness = useCallback(
    id => {
      const newSelected = new Map(state.illness);
      newSelected.set(id, !state.illness.get(id));

      setState({ illness: newSelected });
    },
    [state.illness],
  );

  const debouncedState = useDebounce(state, 300);

  useEffect(() => {
    const hasSymptoms =
      state.symptoms.size > 0 &&
      Array.from(state.symptoms).find((s: [string, boolean]) => s[1]);

    if (
      !!hasSymptoms &&
      state?.travel &&
      state?.confirmedContact &&
      state?.suspectedContact &&
      state?.outOfBreath &&
      state?.pregnant &&
      (state.age > 0 || state?.newBorn === 'yes')
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [debouncedState]);

  const handlePress = () => {
    function hasExtraConditions() {
      const hasIllness =
        state.illness.size > 0 &&
        Array.from(state.illness).find((s: [string, boolean]) => s[1]);

      state.age >= 60 || state.pregnant === 'yes' || !!hasIllness;
      if (
        state.age >= 60 ||
        state.newBorn === 'yes' ||
        state.pregnant === 'yes' ||
        !!hasIllness
      ) {
        onShowResults('negative');
      } else {
        onShowResults('neutral');
      }
    }
    if (
      state.symptoms.get('fever') &&
      state.symptoms.get('breath') &&
      state.travel === 'yes' &&
      state.confirmedContact === 'yes' &&
      state.suspectedContact === 'yes'
    ) {
      if (state.outOfBreath === 'yes') {
        onShowResults('negative');
      } else {
        hasExtraConditions();
      }
    } else {
      onShowResults('positive');
    }

    setState(initialState);
    scrollRef.current.scrollTo({ x: 0, animated: false });
  };

  const scrollRef = React.useRef<ScrollView | null>(null);

  useScrollToTop(scrollRef);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.questContainer}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        <Text style={styles.title}>
          Si tenés algún malestar y pensás que puede estar ligado a la infección
          de coronavirus, aquí te haremos un par de preguntas pidiendo que
          detalles los síntomas que estás teniendo y también saber si creés
          haber estado en contacto con alguien infectado.
        </Text>
        <Text style={styles.subtitle}>¿Recien Nacido?</Text>
        <View style={styles.questButtons}>
          <YesNoButtons id="newBorn" onPress={setState} state={state} />
        </View>
        {state.newBorn === 'no' && (
          <TextInput
            placeholder="Edad"
            onChangeText={text => setState({ age: text })}
            value={state.age}
            keyboardType="number-pad"
            style={styles.input}
          />
        )}
        <Text style={styles.subtitle}>Dolencias y síntomas</Text>
        <View style={styles.questButtons}>
          <QuestButton
            id="fever"
            text="Fiebre"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="cough"
            text="Tos seca"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="throat"
            text="Dolor de garganta"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="breath"
            text="Dificultad para respirar"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="headache"
            text="Dolor de cabeza"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="diarrhea"
            text="Descompostura o diarrea"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
          <QuestButton
            id="tiredness"
            text="Cansancio general"
            onPress={onSelectSymptoms}
            selected={state.symptoms}
          />
        </View>
        <Text style={styles.subtitle}>Contacto cercano</Text>
        <Text style={styles.subtitle}>
          ¿Volviste de viaje de algún país con algún caso confirmado de
          coronavirus?
        </Text>
        <View style={styles.questButtons}>
          <YesNoButtons id="travel" onPress={setState} state={state} />
        </View>
        <Text style={styles.subtitle}>
          ¿Tuviste contacto con alguien que haya sido confirmado como
          contagiado?
        </Text>
        <View style={styles.questButtons}>
          <YesNoButtons
            id="confirmedContact"
            onPress={setState}
            state={state}
          />
        </View>
        <Text style={styles.subtitle}>
          ¿Tuviste contacto con alguien que sospeches se haya contagiado?
        </Text>
        <View style={styles.questButtons}>
          <YesNoButtons
            id="suspectedContact"
            onPress={setState}
            state={state}
          />
        </View>
        <Text style={styles.subtitle}>¿Te falta el aire?</Text>
        <View style={styles.questButtons}>
          <YesNoButtons id="outOfBreath" onPress={setState} state={state} />
        </View>
        <Text style={styles.subtitle}>¿Estas embarazada?</Text>
        <View style={styles.questButtons}>
          <YesNoButtons id="pregnant" onPress={setState} state={state} />
        </View>
        <Text style={styles.subtitle}>Antecedentes médicos</Text>
        <View style={styles.questButtons}>
          <QuestButton
            id="cancer"
            text="Cáncer"
            onPress={onSelectIllness}
            selected={state.illness}
          />
          <QuestButton
            id="cholesterol"
            text="Colesterol"
            onPress={onSelectIllness}
            selected={state.illness}
          />
          <QuestButton
            id="diabetes"
            text="Diabetes"
            onPress={onSelectIllness}
            selected={state.illness}
          />
          <QuestButton
            id="cardio"
            text="Enfermedades cardiovasculares"
            onPress={onSelectIllness}
            selected={state.illness}
          />
          <QuestButton
            id="respiratory"
            text="Enfermedades respiratorias"
            onPress={onSelectIllness}
            selected={state.illness}
          />
          <QuestButton
            id="ms"
            text="Esclerosis múltiple"
            onPress={onSelectIllness}
            selected={state.illness}
          />
          <QuestButton
            id="hypertension"
            text="Hipertensión arterial"
            onPress={onSelectIllness}
            selected={state.illness}
          />
          <QuestButton
            id="hyperthyroidism"
            text="Hipotiroidismo o hipertiroidismo"
            onPress={onSelectIllness}
            selected={state.illness}
          />
        </View>
        {/* </ReAnimated.View> */}
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
      <RectButton
        enabled={!disabled}
        style={[
          styles.button,
          styles.activeButton,
          { width: undefined, margin: 10 },
          disabled && { backgroundColor: '#ccc' },
        ]}
        onPress={handlePress}
      >
        <Text style={[styles.buttonText, styles.activeButtonText]}>
          REALIZAR DIAGNÓSTICO
        </Text>
      </RectButton>
    </>
  );
}

export default function Diagnostic({ navigation }) {
  const onShowResults = (value: QuestResults) => {
    navigation.navigate('DiagnosticResults', {
      results: value,
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Questionary onShowResults={onShowResults} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: { paddingTop: 20 },
  subtitle: { paddingTop: 20, paddingBottom: 10 },
  button: {
    flexDirection: 'row',
    minHeight: 50,
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  buttonText: {
    padding: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  activeButton: {
    backgroundColor: '#29C097',
  },
  activeButtonText: { color: '#fff' },
  input: {
    padding: 15,
    marginTop: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgb(204,204,204)',
  },
  panel: {
    height: 80,
    padding: 20,
    backgroundColor: '#ffffffFA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  panelButton: {
    // minHeight: 50,
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderRadius: 10,
    // backgroundColor: '#29C097',
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});
