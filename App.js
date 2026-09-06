import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import bikeCatalog from './app/src/data/bike_catalog.json';
import diagnosticFlows from './app/src/data/diagnostic_flows.json';
import repairGuides from './app/src/data/repair_guides.json';
import symptomSearch from './app/src/diagnostics/symptom_search.json';

const symptoms = [
  "Won’t Start", 'No Spark', 'No Fuel', 'Low Compression',
  'Overheating', 'Backfiring', 'Strange Noise',
];

const symptomFlowIds = {
  "Won’t Start": 'wont-start',
  'No Spark': 'no-spark',
  'No Fuel': 'no-fuel',
  'Low Compression': 'low-compression',
  'Overheating': 'overheating',
  'Backfiring': 'backfiring',
  'Strange Noise': 'strange-noise',
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [symptom, setSymptom] = useState(null);
  const [stepId, setStepId] = useState(null);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [resultKey, setResultKey] = useState(null);
  const [guide, setGuide] = useState(null);

  const bikeTitle = useMemo(() => brand && model ? `${brand} ${model}` : 'My Bike', [brand, model]);
  const selectedBrand = bikeCatalog.brands.find(item => item.name === brand);
  const flow = diagnosticFlows.flows.find(item => item.id === symptomFlowIds[symptom]);
  const currentQuestion = flow?.steps?.find(item => item.id === stepId);
  const result = resultKey ? flow?.results?.[resultKey] : null;

  const chooseSymptom = value => {
    const flowId = symptomFlowIds[value];
    const selectedFlow = diagnosticFlows.flows.find(item => item.id === flowId);
    setSymptom(value);
    setHistory([]);
    setAnswers([]);
    setResultKey(null);
    setStepId(selectedFlow?.steps?.[0]?.id || null);
    setScreen(selectedFlow ? 'diagnose' : 'symptoms');
  };

  const answer = value => {
    if (!currentQuestion || !flow) return;
    const next = currentQuestion[value];
    setAnswers(prev => [...prev, { step: currentQuestion.id, answer: value }]);

    if (next && flow.steps.some(item => item.id === next)) {
      setHistory(prev => [...prev, currentQuestion.id]);
      setStepId(next);
      return;
    }

    setResultKey(next || Object.keys(flow.results || {})[0]);
    setScreen('result');
  };

  const goBack = () => {
    if (history.length) {
      const previous = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setStepId(previous);
      return;
    }
    setScreen('symptoms');
  };

  const reset = () => {
    setScreen('home'); setSymptom(null); setStepId(null); setHistory([]);
    setAnswers([]); setResultKey(null); setGuide(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View><Text style={styles.brandText}>DIRT BIKE DOCTOR</Text><Text style={styles.tagline}>Diagnose. Repair. Ride.</Text></View>
          <Text style={styles.cross}>✚</Text>
        </View>

        {screen === 'home' && <>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>What’s wrong with your bike?</Text>
            <Text style={styles.muted}>Pick a symptom and we’ll walk you through the checks.</Text>
            <TouchableOpacity style={styles.primary} onPress={() => setScreen('symptoms')}><Text style={styles.primaryText}>START DIAGNOSIS</Text></TouchableOpacity>
          </View>
          <Section title="My Bike" />
          <TouchableOpacity style={styles.card} onPress={() => setScreen('brands')}>
            <Text style={styles.cardTitle}>{bikeTitle}</Text>
            <Text style={styles.muted}>{brand && model ? 'Saved bike profile' : 'Select your brand and model'}</Text>
          </TouchableOpacity>
          <Section title="Quick Diagnosis" />
          <View style={styles.grid}>{symptoms.slice(0, 4).map(s => <Tile key={s} label={s} onPress={() => chooseSymptom(s)} />)}</View>
          <TouchableOpacity style={styles.secondary} onPress={() => setScreen('guides')}><Text style={styles.secondaryText}>REPAIR GUIDES</Text></TouchableOpacity>
        </>}

        {screen === 'symptoms' && <>
          <Section title="Choose a problem" />
          {symptoms.map(s => <ListItem key={s} label={s} onPress={() => chooseSymptom(s)} />)}
          <Back onPress={reset} />
        </>}

        {screen === 'brands' && <>
          <Section title="Choose your bike brand" />
          {bikeCatalog.brands.map(item => <ListItem key={item.name} label={item.name} onPress={() => { setBrand(item.name); setScreen('models'); }} />)}
          <Back onPress={reset} />
        </>}

        {screen === 'models' && <>
          <Section title={`${brand} model`} />
          {(selectedBrand?.models || []).map(m => <ListItem key={m} label={m} onPress={() => { setModel(m); setScreen('home'); }} />)}
          <Back onPress={() => setScreen('brands')} />
        </>}

        {screen === 'diagnose' && currentQuestion && <>
          <Text style={styles.kicker}>{symptom}</Text>
          <Text style={styles.question}>{currentQuestion.question}</Text>
          <Text style={styles.progress}>CHECK {history.length + 1}</Text>
          <TouchableOpacity style={styles.answer} onPress={() => answer('yes')}><Text style={styles.answerText}>YES</Text></TouchableOpacity>
          <TouchableOpacity style={styles.answer} onPress={() => answer('no')}><Text style={styles.answerText}>NO</Text></TouchableOpacity>
          <Back onPress={goBack} />
        </>}

        {screen === 'result' && <>
          <Text style={styles.kicker}>DIAGNOSIS</Text>
          <Text style={styles.question}>{result?.title || symptom}</Text>
          <View style={styles.result}>
            <Text style={styles.resultTitle}>Recommended next step</Text>
            <Text style={styles.muted}>{result?.text || 'Verify the related system using the model-specific service procedure before replacing parts.'}</Text>
            {brand && model && <Text style={styles.resultBullet}>• Bike: {brand} {model}</Text>}
            <Text style={styles.resultBullet}>• Use model-specific specifications and service limits.</Text>
            <Text style={styles.resultBullet}>• Confirm the failed system before replacing components.</Text>
          </View>
          <TouchableOpacity style={styles.primary} onPress={() => setScreen('guides')}><Text style={styles.primaryText}>VIEW REPAIR GUIDES</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondary} onPress={() => chooseSymptom(symptom)}><Text style={styles.secondaryText}>RUN DIAGNOSIS AGAIN</Text></TouchableOpacity>
          <Back onPress={reset} />
        </>}

        {screen === 'guides' && <>
          <Section title="Repair Guides" />
          {repairGuides.guides.map(g => <ListItem key={g.title} label={g.title} sub={g.category} onPress={() => { setGuide(g); setScreen('guide'); }} />)}
          {symptomSearch.symptoms.map(item => <ListItem key={item.problem} label={item.problem} sub={`Possible causes: ${item.possible_causes.join(', ')}`} onPress={() => setScreen('symptoms')} />)}
          <Back onPress={reset} />
        </>}

        {screen === 'guide' && guide && <>
          <Text style={styles.kicker}>REPAIR GUIDE</Text>
          <Text style={styles.question}>{guide.title}</Text>
          <View style={styles.result}>
            <Text style={styles.resultTitle}>{guide.category}</Text>
            {guide.steps.map((item, index) => <Text key={item} style={styles.resultBullet}>{index + 1}. {item}</Text>)}
            <Text style={styles.muted}>Always verify model-specific specifications, service limits, and torque values before performing a repair.</Text>
          </View>
          <Back onPress={() => setScreen('guides')} />
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title }) { return <Text style={styles.section}>{title}</Text>; }
function Tile({ label, onPress }) { return <TouchableOpacity style={styles.tile} onPress={onPress}><Text style={styles.tileText}>{label}</Text></TouchableOpacity>; }
function ListItem({ label, sub, onPress }) { return <TouchableOpacity style={styles.listItem} onPress={onPress}><View style={{ flex: 1 }}><Text style={styles.listText}>{label}</Text>{sub && <Text style={styles.sub}>{sub}</Text>}</View><Text style={styles.arrow}>›</Text></TouchableOpacity>; }
function Back({ onPress }) { return <TouchableOpacity style={styles.back} onPress={onPress}><Text style={styles.muted}>‹ Back</Text></TouchableOpacity>; }

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#090909'},container:{padding:20,paddingBottom:48},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:28},brandText:{color:'#fff',fontSize:19,fontWeight:'900',letterSpacing:1.4},tagline:{color:'#a0a0a0',marginTop:3},cross:{color:'#e21d2f',fontSize:30,fontWeight:'900'},hero:{backgroundColor:'#151515',borderRadius:18,padding:22,marginBottom:24,borderWidth:1,borderColor:'#292929'},heroTitle:{color:'#fff',fontSize:27,fontWeight:'900',lineHeight:32,marginBottom:10},muted:{color:'#a6a6a6',fontSize:14,lineHeight:21},primary:{backgroundColor:'#e21d2f',borderRadius:12,padding:16,alignItems:'center',marginTop:20},primaryText:{color:'#fff',fontWeight:'900',letterSpacing:1},secondary:{borderColor:'#444',borderWidth:1,borderRadius:12,padding:16,alignItems:'center',marginTop:12},secondaryText:{color:'#fff',fontWeight:'800',letterSpacing:1},section:{color:'#fff',fontSize:19,fontWeight:'800',marginBottom:12,marginTop:6},card:{backgroundColor:'#151515',padding:18,borderRadius:14,marginBottom:24},cardTitle:{color:'#fff',fontSize:17,fontWeight:'800',marginBottom:4},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},tile:{width:'48%',backgroundColor:'#151515',padding:18,borderRadius:14,minHeight:70,justifyContent:'center'},tileText:{color:'#fff',fontWeight:'700'},listItem:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#151515',padding:18,borderRadius:13,marginBottom:10},listText:{color:'#fff',fontSize:16,fontWeight:'700'},sub:{color:'#888',marginTop:4,lineHeight:18},arrow:{color:'#e21d2f',fontSize:28},kicker:{color:'#e21d2f',fontSize:13,fontWeight:'900',letterSpacing:1.2,marginTop:10},question:{color:'#fff',fontSize:28,lineHeight:34,fontWeight:'900',marginTop:8,marginBottom:12},progress:{color:'#777',fontSize:12,fontWeight:'800',marginBottom:24},answer:{backgroundColor:'#151515',borderWidth:1,borderColor:'#333',borderRadius:14,padding:20,marginBottom:12,alignItems:'center'},answerText:{color:'#fff',fontWeight:'900',letterSpacing:1},result:{backgroundColor:'#151515',borderRadius:16,padding:20,marginVertical:14},resultTitle:{color:'#fff',fontSize:20,fontWeight:'900',marginBottom:8},resultBullet:{color:'#ddd',marginTop:12},back:{paddingVertical:20,alignItems:'center'}});
