import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const brands = ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'KTM', 'Husqvarna', 'GasGas', 'Beta'];
const symptoms = ['Won’t Start', 'No Spark', 'No Fuel', 'Low Compression', 'Overheating', 'Backfiring', 'Strange Noise'];
const wontStartFlow = [
  { question: 'Does the engine turn over?' },
  { question: 'Do you have spark?' },
  { question: 'Is fuel reaching the engine?' },
  { question: 'Does the kickstarter feel unusually easy?' }
];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [bike, setBike] = useState(null);
  const [symptom, setSymptom] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const title = useMemo(() => bike ? `${bike} Garage` : 'Dirt Bike Doctor', [bike]);

  const chooseSymptom = (value) => { setSymptom(value); setStep(0); setAnswers([]); setScreen('diagnose'); };
  const answer = (value) => { const next = [...answers, value]; setAnswers(next); if (step < wontStartFlow.length - 1) setStep(step + 1); else setScreen('result'); };
  const reset = () => { setScreen('home'); setSymptom(null); setStep(0); setAnswers([]); };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}><View><Text style={styles.brand}>DIRT BIKE DOCTOR</Text><Text style={styles.tagline}>Diagnose. Repair. Ride.</Text></View><Text style={styles.cross}>✚</Text></View>
        {screen === 'home' && <><View style={styles.hero}><Text style={styles.heroTitle}>What’s wrong with your bike?</Text><Text style={styles.muted}>Start with a symptom and we’ll walk you through the checks.</Text><TouchableOpacity style={styles.primary} onPress={() => setScreen('symptoms')}><Text style={styles.primaryText}>START DIAGNOSIS</Text></TouchableOpacity></View><Section title="My Bike" /><TouchableOpacity style={styles.card} onPress={() => setScreen('garage')}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>{bike ? 'Saved bike profile' : 'Add your bike to your garage'}</Text></TouchableOpacity><Section title="Quick Diagnosis" /><View style={styles.grid}>{symptoms.slice(0, 4).map(s => <Tile key={s} label={s} onPress={() => chooseSymptom(s)} />)}</View></>}
        {screen === 'symptoms' && <><Section title="Choose a problem" />{symptoms.map(s => <TouchableOpacity key={s} style={styles.listItem} onPress={() => chooseSymptom(s)}><Text style={styles.listText}>{s}</Text><Text style={styles.arrow}>›</Text></TouchableOpacity>)}<Back onPress={reset} /></>}
        {screen === 'diagnose' && <><Text style={styles.kicker}>{symptom}</Text><Text style={styles.question}>{wontStartFlow[step].question}</Text><Text style={styles.progress}>CHECK {step + 1} OF {wontStartFlow.length}</Text><TouchableOpacity style={styles.answer} onPress={() => answer('yes')}><Text style={styles.answerText}>YES</Text></TouchableOpacity><TouchableOpacity style={styles.answer} onPress={() => answer('no')}><Text style={styles.answerText}>NO</Text></TouchableOpacity><Back onPress={() => step > 0 ? setStep(step - 1) : setScreen('symptoms')} /></>}
        {screen === 'result' && <><Text style={styles.kicker}>DIAGNOSIS</Text><Text style={styles.question}>Most likely next checks</Text><View style={styles.result}><Text style={styles.resultTitle}>Start with the basics</Text><Text style={styles.muted}>Verify spark, fuel, compression, and timing before replacing parts.</Text><Text style={styles.resultBullet}>• Spark plug and ignition</Text><Text style={styles.resultBullet}>• Fuel delivery</Text><Text style={styles.resultBullet}>• Compression and valve clearance</Text><Text style={styles.resultBullet}>• Cam timing and timing chain</Text></View><TouchableOpacity style={styles.primary} onPress={() => setScreen('guides')}><Text style={styles.primaryText}>VIEW REPAIR GUIDES</Text></TouchableOpacity><Back onPress={reset} /></>}
        {screen === 'garage' && <><Section title="Select your bike brand" />{brands.map(b => <TouchableOpacity key={b} style={styles.listItem} onPress={() => { setBike(b); setScreen('home'); }}><Text style={styles.listText}>{b}</Text><Text style={styles.arrow}>›</Text></TouchableOpacity>)}<Back onPress={reset} /></>}
        {screen === 'guides' && <><Section title="Repair Guides" />{['Valve Adjustment', 'Timing Chain Check', 'Carburetor Cleaning', 'Top End Inspection', 'Spark Plug Diagnosis', 'Air Filter Service'].map(g => <TouchableOpacity key={g} style={styles.listItem}><Text style={styles.listText}>{g}</Text><Text style={styles.arrow}>›</Text></TouchableOpacity>)}<Back onPress={reset} /></>}
      </ScrollView>
    </SafeAreaView>
  );
}
function Section({ title }) { return <Text style={styles.section}>{title}</Text>; }
function Tile({ label, onPress }) { return <TouchableOpacity style={styles.tile} onPress={onPress}><Text style={styles.tileText}>{label}</Text></TouchableOpacity>; }
function Back({ onPress }) { return <TouchableOpacity style={styles.back} onPress={onPress}><Text style={styles.muted}>‹ Back</Text></TouchableOpacity>; }
const styles = StyleSheet.create({ safe:{flex:1,backgroundColor:'#090909'}, container:{padding:20,paddingBottom:48}, header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:28}, brand:{color:'#fff',fontSize:19,fontWeight:'900',letterSpacing:1.4}, tagline:{color:'#a0a0a0',marginTop:3}, cross:{color:'#e21d2f',fontSize:30,fontWeight:'900'}, hero:{backgroundColor:'#151515',borderRadius:18,padding:22,marginBottom:24,borderWidth:1,borderColor:'#292929'}, heroTitle:{color:'#fff',fontSize:27,fontWeight:'900',lineHeight:32,marginBottom:10}, muted:{color:'#a6a6a6',fontSize:14,lineHeight:21}, primary:{backgroundColor:'#e21d2f',borderRadius:12,padding:16,alignItems:'center',marginTop:20}, primaryText:{color:'#fff',fontWeight:'900',letterSpacing:1}, section:{color:'#fff',fontSize:19,fontWeight:'800',marginBottom:12,marginTop:6}, card:{backgroundColor:'#151515',padding:18,borderRadius:14,marginBottom:24}, cardTitle:{color:'#fff',fontSize:17,fontWeight:'800',marginBottom:4}, grid:{flexDirection:'row',flexWrap:'wrap',gap:10}, tile:{width:'48%',backgroundColor:'#151515',padding:18,borderRadius:14,minHeight:70,justifyContent:'center'}, tileText:{color:'#fff',fontWeight:'700'}, listItem:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#151515',padding:18,borderRadius:13,marginBottom:10}, listText:{color:'#fff',fontSize:16,fontWeight:'700'}, arrow:{color:'#e21d2f',fontSize:28}, kicker:{color:'#e21d2f',fontSize:13,fontWeight:'900',letterSpacing:1.2,marginTop:10}, question:{color:'#fff',fontSize:28,lineHeight:34,fontWeight:'900',marginTop:8,marginBottom:12}, progress:{color:'#777',fontSize:12,fontWeight:'800',marginBottom:24}, answer:{backgroundColor:'#151515',borderWidth:1,borderColor:'#333',borderRadius:14,padding:20,marginBottom:12,alignItems:'center'}, answerText:{color:'#fff',fontWeight:'900',letterSpacing:1}, result:{backgroundColor:'#151515',borderRadius:16,padding:20,marginVertical:14}, resultTitle:{color:'#fff',fontSize:20,fontWeight:'900',marginBottom:8}, resultBullet:{color:'#ddd',marginTop:12}, back:{paddingVertical:20,alignItems:'center'} });
