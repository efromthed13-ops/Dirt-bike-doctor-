import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import bikeCatalog from './app/src/data/bike_catalog.json';
import diagnosticFlows from './app/src/data/diagnostic_flows.json';
import modelProfiles from './app/src/data/model_profiles.json';
import modelYearProfiles from './app/src/data/model_year_profiles.json';
import repairGuides from './app/src/data/repair_guides.json';
import symptomSearch from './app/src/diagnostics/symptom_search.json';

const symptoms = ["Won’t Start", 'No Spark', 'No Fuel', 'Low Compression', 'Overheating', 'Backfiring', 'Strange Noise'];
const symptomFlowIds = { "Won’t Start": 'wont-start', 'No Spark': 'no-spark', 'No Fuel': 'no-fuel', 'Low Compression': 'low-compression', Overheating: 'overheating', Backfiring: 'backfiring', 'Strange Noise': 'strange-noise' };
const CURRENT_YEAR = new Date().getFullYear();
const FIRST_YEAR = 1980;
const years = Array.from({ length: CURRENT_YEAR - FIRST_YEAR + 1 }, (_, index) => CURRENT_YEAR - index);

export default function App() {
  const [screen, setScreen] = useState('home');
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [year, setYear] = useState(null);
  const [symptom, setSymptom] = useState(null);
  const [stepId, setStepId] = useState(null);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [resultKey, setResultKey] = useState(null);
  const [guide, setGuide] = useState(null);

  const bikeTitle = useMemo(() => brand && model ? `${brand} ${model}${year ? ` (${year})` : ''}` : 'My Bike', [brand, model, year]);
  const selectedBrand = bikeCatalog.brands.find(item => item.name === brand);
  const profile = brand && model ? modelProfiles.profiles[`${brand}|${model}`] : null;
  const yearProfileKey = brand && model && year ? `${brand}|${model}|${year}` : null;
  const yearProfile = yearProfileKey ? modelYearProfiles.profiles[yearProfileKey] : null;
  const exactData = yearProfile || profile;
  const exactVerified = Boolean(yearProfile?.verified);
  const flow = diagnosticFlows.flows.find(item => item.id === symptomFlowIds[symptom]);
  const currentQuestion = flow?.steps?.find(item => item.id === stepId);
  const result = resultKey ? flow?.results?.[resultKey] : null;

  const chooseSymptom = value => {
    const selectedFlow = diagnosticFlows.flows.find(item => item.id === symptomFlowIds[value]);
    setSymptom(value); setHistory([]); setAnswers([]); setResultKey(null);
    setStepId(selectedFlow?.steps?.[0]?.id || null); setScreen(selectedFlow ? 'diagnose' : 'symptoms');
  };

  const answer = value => {
    if (!currentQuestion || !flow) return;
    const next = currentQuestion[value];
    setAnswers(prev => [...prev, { step: currentQuestion.id, answer: value }]);
    if (next && flow.steps.some(item => item.id === next)) {
      setHistory(prev => [...prev, currentQuestion.id]); setStepId(next); return;
    }
    setResultKey(next || Object.keys(flow.results || {})[0]); setScreen('result');
  };

  const goBack = () => {
    if (history.length) {
      const previous = history[history.length - 1]; setHistory(prev => prev.slice(0, -1)); setStepId(previous); return;
    }
    setScreen('symptoms');
  };

  const reset = () => {
    setScreen('home'); setSymptom(null); setStepId(null); setHistory([]); setAnswers([]); setResultKey(null); setGuide(null);
  };

  const chooseModel = value => { setModel(value); setYear(null); setScreen('years'); };
  const chooseYear = value => { setYear(value); setScreen('home'); };

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
            <Text style={styles.muted}>{profile ? `${profile.family} • ${profile.engine}` : 'Select your brand, model, and year'}</Text>
            {exactData && <Text style={styles.profileText}>Fueling: {exactData.fueling}</Text>}
            {brand && model && year && <Badge exact={exactVerified} />}
          </TouchableOpacity>
          {exactData && <View style={styles.profileCard}>
            <Text style={styles.resultTitle}>{year ? `${year} ${brand} ${model}` : 'Model-specific diagnostic focus'}</Text>
            {exactData.focus?.map(item => <Text key={item} style={styles.resultBullet}>• {item}</Text>)}
            {exactVerified ? <Text style={styles.verified}>Exact model-year data verified.</Text> : <Text style={styles.warning}>Model-family baseline. Exact year-specific service data has not been verified yet, so the app will not invent specifications.</Text>}
          </View>}
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
          {bikeCatalog.brands.map(item => <ListItem key={item.name} label={item.name} onPress={() => { setBrand(item.name); setModel(null); setYear(null); setScreen('models'); }} />)}
          <Back onPress={reset} />
        </>}

        {screen === 'models' && <>
          <Section title={`${brand} model`} />
          {(selectedBrand?.models || []).map(m => <ListItem key={m} label={m} sub={modelProfiles.profiles[`${brand}|${m}`]?.engine} onPress={() => chooseModel(m)} />)}
          <Back onPress={() => setScreen('brands')} />
        </>}

        {screen === 'years' && <>
          <Section title={`${brand} ${model} year`} />
          <Text style={styles.muted}>Select the exact model year. The app will use verified year-specific data when available and otherwise fall back to the model-family baseline.</Text>
          <View style={styles.yearGrid}>{years.map(item => {
            const key = `${brand}|${model}|${item}`;
            const verified = Boolean(modelYearProfiles.profiles[key]?.verified);
            return <TouchableOpacity key={item} style={styles.yearTile} onPress={() => chooseYear(item)}><Text style={styles.yearText}>{item}</Text>{verified && <Text style={styles.dot}>✓</Text>}</TouchableOpacity>;
          })}</View>
          <Back onPress={() => setScreen('models')} />
        </>}

        {screen === 'diagnose' && currentQuestion && <>
          <Text style={styles.kicker}>{symptom}</Text>
          {profile && <Text style={styles.context}>{bikeTitle} • {exactVerified ? 'Exact year data' : 'Model-family baseline'}</Text>}
          <Text style={styles.question}>{currentQuestion.question}</Text>
          <Text style={styles.progress}>CHECK {history.length + 1}</Text>
          <TouchableOpacity style={styles.answer} onPress={() => answer('yes')}><Text style={styles.answerText}>YES</Text></TouchableOpacity>
          <TouchableOpacity style={styles.answer} onPress={() => answer('no')}><Text style={styles.answerText}>NO</Text></TouchableOpacity>
          <Back onPress={goBack} />
        </>}

        {screen === 'result' && <>
          <Text style={styles.kicker}>DIAGNOSIS</Text>
          <Text style={styles.question}>{result?.title || symptom}</Text>
          {profile && <Text style={styles.context}>{bikeTitle} • {profile.family}</Text>}
          <View style={styles.result}>
            <Text style={styles.resultTitle}>Recommended next step</Text>
            <Text style={styles.muted}>{result?.text || 'Verify the related system using the model-specific service procedure before replacing parts.'}</Text>
            {exactData?.focus && <><Text style={styles.resultTitleSmall}>For this bike</Text><Text style={styles.muted}>Prioritize: {exactData.focus.join(', ')}.</Text></>}
            <Text style={styles.resultBullet}>• Use exact year/model service specifications when verified.</Text>
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
            {profile && <Text style={styles.warning}>Selected bike: {bikeTitle}. Verify all measurements, torque values, clearances, and service limits for the exact year.</Text>}
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
function Badge({ exact }) { return <View style={[styles.badge, exact ? styles.badgeVerified : styles.badgeBaseline]}><Text style={styles.badgeText}>{exact ? 'YEAR-SPECIFIC VERIFIED' : 'MODEL-YEAR DATA PENDING'}</Text></View>; }
function Back({ onPress }) { return <TouchableOpacity style={styles.back} onPress={onPress}><Text style={styles.muted}>‹ Back</Text></TouchableOpacity>; }

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#090909'},container:{padding:20,paddingBottom:48},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:28},brandText:{color:'#fff',fontSize:19,fontWeight:'900',letterSpacing:1.4},tagline:{color:'#a0a0a0',marginTop:3},cross:{color:'#e21d2f',fontSize:30,fontWeight:'900'},hero:{backgroundColor:'#151515',borderRadius:18,padding:22,marginBottom:24,borderWidth:1,borderColor:'#292929'},heroTitle:{color:'#fff',fontSize:27,fontWeight:'900',lineHeight:32,marginBottom:10},muted:{color:'#a6a6a6',fontSize:14,lineHeight:21},primary:{backgroundColor:'#e21d2f',borderRadius:12,padding:16,alignItems:'center',marginTop:20},primaryText:{color:'#fff',fontWeight:'900',letterSpacing:1},secondary:{borderColor:'#444',borderWidth:1,borderRadius:12,padding:16,alignItems:'center',marginTop:12},secondaryText:{color:'#fff',fontWeight:'800',letterSpacing:1},section:{color:'#fff',fontSize:19,fontWeight:'800',marginBottom:12,marginTop:6},card:{backgroundColor:'#151515',padding:18,borderRadius:14,marginBottom:12},cardTitle:{color:'#fff',fontSize:17,fontWeight:'800',marginBottom:4},profileText:{color:'#ccc',fontSize:13,marginTop:8},profileCard:{backgroundColor:'#101010',borderWidth:1,borderColor:'#292929',padding:18,borderRadius:14,marginBottom:24},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},tile:{width:'48%',backgroundColor:'#151515',padding:18,borderRadius:14,minHeight:70,justifyContent:'center'},tileText:{color:'#fff',fontWeight:'700'},listItem:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#151515',padding:18,borderRadius:13,marginBottom:10},listText:{color:'#fff',fontSize:16,fontWeight:'700'},sub:{color:'#888',marginTop:4,lineHeight:18},arrow:{color:'#e21d2f',fontSize:28},yearGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginTop:18},yearTile:{width:'30%',minHeight:54,backgroundColor:'#151515',borderRadius:12,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#292929',position:'relative'},yearText:{color:'#fff',fontSize:16,fontWeight:'800'},dot:{color:'#e21d2f',fontSize:12,fontWeight:'900',position:'absolute',top:5,right:7},badge:{alignSelf:'flex-start',borderRadius:8,paddingVertical:6,paddingHorizontal:9,marginTop:10},badgeVerified:{borderWidth:1,borderColor:'#555'},badgeBaseline:{borderWidth:1,borderColor:'#333'},badgeText:{color:'#ddd',fontSize:10,fontWeight:'900',letterSpacing:.6},verified:{color:'#ddd',fontSize:12,fontWeight:'800',marginTop:18},kicker:{color:'#e21d2f',fontSize:13,fontWeight:'900',letterSpacing:1.2,marginTop:10},context:{color:'#777',fontSize:13,marginTop:5},question:{color:'#fff',fontSize:28,lineHeight:34,fontWeight:'900',marginTop:8,marginBottom:12},progress:{color:'#777',fontSize:12,fontWeight:'800',marginBottom:24},answer:{backgroundColor:'#151515',borderWidth:1,borderColor:'#333',borderRadius:14,padding:20,marginBottom:12,alignItems:'center'},answerText:{color:'#fff',fontWeight:'900',letterSpacing:1},result:{backgroundColor:'#151515',borderRadius:16,padding:20,marginVertical:14},resultTitle:{color:'#fff',fontSize:20,fontWeight:'900',marginBottom:8},resultTitleSmall:{color:'#fff',fontSize:15,fontWeight:'800',marginTop:18,marginBottom:5},resultBullet:{color:'#ddd',marginTop:12},warning:{color:'#888',fontSize:12,lineHeight:18,marginTop:18},back:{paddingVertical:20,alignItems:'center'}});
