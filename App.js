import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const catalog = {
  Honda: ['CRF250R', 'CRF450R', 'CRF250RX', 'CRF450RX'],
  Yamaha: ['YZ125', 'YZ250', 'YZ250F', 'YZ450F'],
  Kawasaki: ['KX112', 'KX250', 'KX450'],
  Suzuki: ['RM85', 'RM125', 'RM250', 'RM-Z250', 'RM-Z450'],
  KTM: ['125 SX', '250 SX', '250 SX-F', '350 SX-F', '450 SX-F'],
  Husqvarna: ['TC 125', 'TC 250', 'FC 250', 'FC 350', 'FC 450'],
  GasGas: ['MC 125', 'MC 250', 'MC 250F', 'MC 350F', 'MC 450F'],
  Beta: ['125 RR', '200 RR', '250 RR', '300 RR', '350 RR', '390 RR', '430 RR', '480 RR']
};

const flows = {
  'Won’t Start': [
    { question: 'Does the engine turn over when you kick or press the starter?', yes: 'Engine turns over. Check the kill switch, fuel supply, air filter, and then spark and compression.', no: 'Engine does not turn over. Do not force the kickstarter. Check for a jammed starter mechanism or mechanical lock; stop if it binds.' },
    { question: 'Did it stop suddenly, or did the kickstarter become unusually easy?', yes: 'A sudden stop or loss of resistance can indicate a timing, valve, piston, or other mechanical problem. Stop repeated starting attempts and inspect before running again.', no: 'If it gradually became harder to start, inspect maintenance items such as the air filter, plug, fuel delivery, and valve clearance.' }
  ],
  'No Spark': [
    { question: 'Is the spark plug wet, cracked, or visibly damaged?', yes: 'Dry or replace the plug as appropriate, then verify the correct plug and gap for the exact model.', no: 'Continue with the ignition circuit: cap, wiring, kill switch, coil, and model-specific stator/CDI checks.' },
    { question: 'Have you tested with a proper inline spark tester?', yes: 'If spark is still absent, follow the exact service-manual electrical tests and specifications.', no: 'Use an inline spark tester when possible. Avoid holding a plug or wire by hand during testing.' }
  ],
  'No Fuel': [
    { question: 'Is there fuel in the tank and is the fuel valve open (if fitted)?', yes: 'Inspect the fuel line, filter, tank vent, and carburetor/injector supply.', no: 'Add the correct fresh fuel and open the fuel valve if equipped.' },
    { question: 'Does fuel reach the carburetor or injection system?', yes: 'Check carburetor jets/float or the fuel-injection system using model-specific procedures.', no: 'Inspect for a kinked line, blocked filter, tank vent issue, or faulty fuel pump on equipped models.' }
  ],
  'Low Compression': [
    { question: 'Does the kickstarter feel noticeably easier than normal?', yes: 'Avoid continued running attempts. A compression/leak-down test and valve/timing inspection may be needed.', no: 'Kick feel alone cannot confirm compression. Use a suitable tester and the exact service-manual procedure.' },
    { question: 'Has valve clearance or top-end service been checked recently?', yes: 'Compare measured values with the exact year/model service limits.', no: 'Schedule a valve-clearance inspection or compression/leak-down test; procedures vary by engine.' }
  ],
  'Overheating': [
    { question: 'Is the coolant low or is there visible coolant leaking? (liquid-cooled bikes)', yes: 'Let the engine cool completely. Find the leak before riding; never open a hot radiator cap.', no: 'Check radiator airflow, debris, hoses, coolant condition, and fan operation if equipped.' },
    { question: 'Does it overheat mostly at low speed or while idling?', yes: 'Inspect airflow and fan operation if fitted; also verify coolant flow and the correct coolant mixture.', no: 'Stop riding until the cause is found. Check coolant circulation and model-specific cooling-system components.' }
  ],
  'Backfiring': [
    { question: 'Does it backfire mainly on deceleration?', yes: 'Check exhaust leaks, intake leaks, and fuel/air settings using the model-specific procedure.', no: 'Inspect fuel quality, ignition condition, valve clearance, and cam timing if symptoms began suddenly.' },
    { question: 'Did the problem start after recent repairs or parts changes?', yes: 'Recheck connectors, intake/exhaust seals, and timing against the service manual.', no: 'Continue with fuel, ignition, and valve checks; do not change jetting without confirming the setup.' }
  ],
  'Strange Noise': [
    { question: 'Is the noise a deep knock from inside the engine?', yes: 'Shut the engine off and do not ride it. Internal bearing or crank damage is possible; get a qualified inspection.', no: 'Identify whether the sound comes from the top end, clutch, chain, sprockets, wheels, or suspension.' },
    { question: 'Does the noise change with engine RPM?', yes: 'Avoid running the engine if the sound is metallic or worsening; locate the source before further operation.', no: 'Check chain slack, sprocket wear, loose fasteners, wheel bearings, and suspension components with the bike safely supported.' }
  ]
};

const guides = [
  { title: 'Spark Plug Diagnosis & Replacement', difficulty: 'Beginner', time: '15–30 min', tools: 'Correct spark-plug socket; feeler gauge if specified', steps: ['Let the engine cool and clean around the plug before removal.', 'Remove the plug and inspect for damage, deposits, or fuel fouling.', 'Confirm the replacement part and gap from the exact service manual.', 'Thread the plug in by hand first, then tighten to the specified torque.', 'Reconnect the cap and test only after reassembly.'] },
  { title: 'Air Filter Service', difficulty: 'Beginner', time: '15–30 min', tools: 'Clean gloves; filter cleaner; correct filter oil for foam filters', steps: ['Remove the seat or cover according to the manual.', 'Prevent dirt from entering the intake while removing the filter.', 'Clean and oil a reusable foam filter using the filter maker’s directions.', 'Inspect the sealing surface and reinstall it securely.', 'Never run the engine without a correctly installed air filter.'] },
  { title: 'Chain Inspection & Adjustment', difficulty: 'Beginner', time: '20–40 min', tools: 'Wrenches; ruler or chain-slack gauge; torque wrench', steps: ['Switch the engine off and support the bike securely.', 'Measure slack at the point and method specified by the manual.', 'Adjust both axle blocks evenly and keep wheel alignment correct.', 'Tighten the axle to the model-specific torque.', 'Recheck slack after tightening; too-tight chains can damage components.'] },
  { title: 'Oil & Filter Service', difficulty: 'Intermediate', time: '30–60 min', tools: 'Drain pan; correct sockets; funnel; correct oil and filter', steps: ['Confirm the exact oil type, quantity, filter, and procedure for the bike.', 'Warm only briefly if the manual recommends it, then shut off the engine.', 'Drain oil safely and replace the filter/screens as specified.', 'Install drain hardware with the specified sealing washer and torque.', 'Add the specified oil amount and verify level using the correct method.'] },
  { title: 'Timing Chain / Cam Timing Inspection', difficulty: 'Advanced', time: 'Model dependent', tools: 'Service manual; hand tools; torque wrench; timing tools as specified', steps: ['Do not proceed without the exact engine service procedure.', 'Set the engine at the specified timing position and confirm marks.', 'Inspect chain tensioner and timing components as directed by the manual.', 'Do not rotate the engine if timing is uncertain or mechanical resistance occurs.', 'Verify timing and all torque values before attempting to start.'] },
  { title: 'Brake Inspection', difficulty: 'Intermediate', time: '20–45 min', tools: 'Inspection light; correct hand tools', steps: ['Inspect pads, rotor, hoses, and caliper for wear or leaks.', 'Replace parts only with compatible components and correct procedures.', 'Never contaminate pads or rotor with oil or grease.', 'If hydraulic work was performed, bleed using the specified fluid and procedure.', 'Confirm firm brake action and test at walking speed before riding.'] }
];

const maintenanceTasks = [
  { id: 'air', title: 'Inspect / clean air filter', interval: 'After dusty rides; follow the manual', note: 'Dusty conditions can require service after every ride.' },
  { id: 'chain', title: 'Clean, lubricate & inspect chain', interval: 'Frequently; after wet or muddy rides', note: 'Check slack using the exact model specification.' },
  { id: 'oil', title: 'Engine oil / filter service', interval: 'Use the exact model and riding-condition schedule', note: 'Do not use a universal hour interval; models differ.' },
  { id: 'valves', title: 'Inspect valve clearance (4-stroke)', interval: 'Use the exact model service schedule', note: 'Not applicable to most 2-stroke engines.' },
  { id: 'brakes', title: 'Inspect brake pads, rotor & fluid', interval: 'Inspect before riding; service as needed', note: 'Do not ride with weak brakes or fluid leaks.' },
  { id: 'tires', title: 'Inspect tires, spokes & controls', interval: 'Before every ride', note: 'Fix damage or loose components before riding.' }
];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [year, setYear] = useState('');
  const [hours, setHours] = useState('');
  const [symptom, setSymptom] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [guide, setGuide] = useState(null);
  const [completed, setCompleted] = useState({});
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('home');
  const bikeTitle = useMemo(() => brand && model ? `${year ? year + ' ' : ''}${brand} ${model}` : 'Add your bike', [brand, model, year]);
  const currentFlow = flows[symptom] || flows['Won’t Start'];
  const chooseSymptom = value => { setSymptom(value); setStep(0); setAnswers([]); setScreen('diagnose'); setTab('diagnose'); };
  const answer = value => {
    const next = [...answers, value];
    setAnswers(next);
    if (step < currentFlow.length - 1) setStep(step + 1);
    else setScreen('result');
  };
  const reset = () => { setScreen('home'); setTab('home'); setSymptom(null); setStep(0); setAnswers([]); setGuide(null); };
  const go = (next, activeTab) => { setScreen(next); if (activeTab) setTab(activeTab); };
  const filteredGuides = guides.filter(g => (g.title + ' ' + g.difficulty + ' ' + g.tools).toLowerCase().includes(search.toLowerCase()));

  return <SafeAreaView style={styles.safe}><StatusBar style="light" /><ScrollView contentContainerStyle={styles.container}>
    <View style={styles.header}><View><Text style={styles.brandText}>DIRT BIKE DOCTOR</Text><Text style={styles.tagline}>Diagnose. Repair. Ride.</Text></View><Text style={styles.cross}>✚</Text></View>
    {screen === 'home' && <>
      <View style={styles.hero}><Text style={styles.eyebrow}>YOUR TRAIL-SIDE MECHANIC</Text><Text style={styles.heroTitle}>Get back to the ride.</Text><Text style={styles.muted}>Step-by-step checks for common dirt bike problems.</Text><TouchableOpacity style={styles.primary} onPress={() => go('symptoms', 'diagnose')}><Text style={styles.primaryText}>START DIAGNOSIS →</Text></TouchableOpacity></View>
      <Section title="My Garage" /><TouchableOpacity style={styles.card} onPress={() => go(brand && model ? 'bike' : 'brands', 'garage')}><Text style={styles.cardTitle}>{bikeTitle}</Text><Text style={styles.muted}>{brand && model ? `${hours ? hours + ' engine hours' : 'Add engine hours'} • Tap to manage bike` : 'Add your bike to get started'}</Text></TouchableOpacity>
      <Section title="Quick Diagnosis" /><View style={styles.grid}>{['Won’t Start','No Spark','No Fuel','Low Compression','Overheating','Backfiring','Strange Noise'].map(s => <Tile key={s} label={s} onPress={() => chooseSymptom(s)} />)}</View>
      <TouchableOpacity style={styles.secondary} onPress={() => go('guides','guides')}><Text style={styles.secondaryText}>BROWSE REPAIR GUIDES</Text></TouchableOpacity>
      <TouchableOpacity style={styles.secondary} onPress={() => go('maintenance','maintenance')}><Text style={styles.secondaryText}>OPEN MAINTENANCE CHECKLIST</Text></TouchableOpacity>
    </>}
    {screen === 'symptoms' && <><Section title="What’s the problem?" />{Object.keys(flows).map(s => <ListItem key={s} label={s} onPress={() => chooseSymptom(s)} />)}<Back onPress={reset} /></>}
    {screen === 'brands' && <><Section title="Choose your bike brand" />{Object.keys(catalog).map(b => <ListItem key={b} label={b} onPress={() => { setBrand(b); setModel(null); go('models','garage'); }} />)}<Back onPress={reset} /></>}
    {screen === 'models' && <><Section title={`Choose a ${brand} model`} />{(catalog[brand] || []).map(m => <ListItem key={m} label={m} onPress={() => { setModel(m); go('bike','garage'); }} />)}<Back onPress={() => go('brands','garage')} /></>}
    {screen === 'bike' && <><Section title="Bike Profile" /><Text style={styles.label}>Year (optional)</Text><TextInput value={year} onChangeText={setYear} placeholder="e.g. 2020" placeholderTextColor="#777" keyboardType="number-pad" style={styles.input} /><Text style={styles.label}>Engine hours (optional)</Text><TextInput value={hours} onChangeText={setHours} placeholder="e.g. 35" placeholderTextColor="#777" keyboardType="decimal-pad" style={styles.input} /><View style={styles.result}><Text style={styles.resultTitle}>{bikeTitle}</Text><Text style={styles.muted}>Year-specific service specifications are not yet built in. Verify values with the official manual for this exact bike.</Text></View><TouchableOpacity style={styles.primary} onPress={() => go('home','home')}><Text style={styles.primaryText}>SAVE BIKE PROFILE</Text></TouchableOpacity><TouchableOpacity style={styles.secondary} onPress={() => go('brands','garage')}><Text style={styles.secondaryText}>CHANGE BIKE</Text></TouchableOpacity><Back onPress={() => go('home','home')} /></>}
    {screen === 'diagnose' && <><Text style={styles.kicker}>{symptom}</Text><Text style={styles.question}>{currentFlow[step].question}</Text><Text style={styles.progress}>CHECK {step + 1} OF {currentFlow.length}</Text><TouchableOpacity style={styles.answer} onPress={() => answer('yes')}><Text style={styles.answerText}>YES</Text></TouchableOpacity><TouchableOpacity style={styles.answer} onPress={() => answer('no')}><Text style={styles.answerText}>NO</Text></TouchableOpacity><Back onPress={() => step > 0 ? (setStep(step - 1), setAnswers(answers.slice(0,-1))) : go('symptoms','diagnose')} /></>}
    {screen === 'result' && <><Text style={styles.kicker}>TROUBLESHOOTING RESULT</Text><Text style={styles.question}>Recommended next checks</Text><View style={styles.result}><Text style={styles.resultTitle}>{answers.some(a => a === 'no') ? 'Investigate the failed check first' : 'Continue with a systematic inspection'}</Text>{currentFlow.map((q,i) => <View key={i} style={styles.resultRow}><Text style={styles.resultBullet}>{i + 1}. {q.question}</Text><Text style={styles.muted}>Your answer: {answers[i] === 'yes' ? 'Yes' : 'No'}</Text><Text style={styles.resultBullet}>{answers[i] === 'yes' ? q.yes : q.no}</Text></View>)}<Text style={styles.muted}>This is preliminary guidance, not a confirmed diagnosis. Stop if the engine locks, makes a deep metallic knock, leaks fuel, or has a serious brake problem.</Text></View><TouchableOpacity style={styles.primary} onPress={() => go('guides','guides')}><Text style={styles.primaryText}>FIND A REPAIR GUIDE</Text></TouchableOpacity><Back onPress={() => go('symptoms','diagnose')} /></>}
    {screen === 'guides' && <><Section title="Repair Guide Library" /><TextInput value={search} onChangeText={setSearch} placeholder="Search guides, tools, or repairs" placeholderTextColor="#777" style={styles.input} />{filteredGuides.map(g => <ListItem key={g.title} label={g.title} sub={`${g.difficulty} • ${g.time}`} onPress={() => { setGuide(g); go('guide','guides'); }} />)}{filteredGuides.length === 0 && <Text style={styles.muted}>No guides match that search.</Text>}<Back onPress={reset} /></>}
    {screen === 'guide' && <><Text style={styles.kicker}>REPAIR GUIDE</Text><Text style={styles.question}>{guide?.title}</Text><View style={styles.result}><Text style={styles.resultTitle}>{guide?.difficulty} • {guide?.time}</Text><Text style={styles.label}>TOOLS</Text><Text style={styles.resultBullet}>{guide?.tools}</Text><Text style={styles.label}>STEPS</Text>{(guide?.steps || []).map((s,i) => <Text key={i} style={styles.resultBullet}>{i+1}. {s}</Text>)}<Text style={styles.muted}>Safety first: exact procedures, parts, fluids, clearances, and torque values must be verified in the manufacturer’s service manual for your year and model.</Text></View><Back onPress={() => go('guides','guides')} /></>}
    {screen === 'maintenance' && <><Section title="Maintenance Checklist" /><Text style={styles.muted}>General reminders only. Use your exact bike’s manual for service intervals; riding conditions can change them.</Text>{maintenanceTasks.map(task => <TouchableOpacity key={task.id} style={styles.listItem} onPress={() => setCompleted({...completed,[task.id]:!completed[task.id]})}><View style={{flex:1,paddingRight:10}}><Text style={styles.listText}>{completed[task.id] ? '✓ ' : '□ '}{task.title}</Text><Text style={styles.sub}>{task.interval}</Text><Text style={styles.muted}>{task.note}</Text></View><Text style={styles.arrow}>{completed[task.id] ? '✓' : '+'}</Text></TouchableOpacity>)}<TouchableOpacity style={styles.secondary} onPress={() => setCompleted({})}><Text style={styles.secondaryText}>RESET CHECKLIST</Text></TouchableOpacity><Back onPress={reset} /></>}
    {screen === 'pro' && <><Text style={styles.kicker}>COMING SOON</Text><Text style={styles.question}>Dirt Bike Doctor Pro</Text><View style={styles.result}><Text style={styles.resultTitle}>Planned premium features</Text>{['Unlimited saved bikes','Expanded repair library','Offline guides','Advanced maintenance history','Photo-assisted troubleshooting'].map(x => <Text key={x} style={styles.resultBullet}>✓ {x}</Text>)}<Text style={styles.muted}>Purchases are not enabled in this prototype. We’ll add subscriptions after the core app is tested.</Text></View><Back onPress={reset} /></>}
  </ScrollView>
  <View style={styles.nav}>{[['home','HOME','home'],['diagnose','DIAGNOSE','symptoms'],['guides','GUIDES','guides'],['garage','GARAGE',brand&&model?'bike':'brands'],['pro','PRO','pro']].map(([key,label,target]) => <TouchableOpacity key={key} style={styles.navItem} onPress={() => go(target,key)}><Text style={[styles.navText,tab===key&&styles.navActive]}>{label}</Text></TouchableOpacity>)}</View>
  </SafeAreaView>;
}

function Section({title}) { return <Text style={styles.section}>{title}</Text>; }
function Tile({label,onPress}) { return <TouchableOpacity style={styles.tile} onPress={onPress}><Text style={styles.tileText}>{label}</Text></TouchableOpacity>; }
function ListItem({label,sub,onPress}) { return <TouchableOpacity style={styles.listItem} onPress={onPress}><View style={{flex:1}}><Text style={styles.listText}>{label}</Text>{sub && <Text style={styles.sub}>{sub}</Text>}</View><Text style={styles.arrow}>›</Text></TouchableOpacity>; }
function Back({onPress}) { return <TouchableOpacity style={styles.back} onPress={onPress}><Text style={styles.muted}>‹ Back</Text></TouchableOpacity>; }

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#090909'},container:{padding:20,paddingBottom:30},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:26},brandText:{color:'#fff',fontSize:19,fontWeight:'900',letterSpacing:1.4},tagline:{color:'#a0a0a0',marginTop:3},cross:{color:'#e21d2f',fontSize:30,fontWeight:'900'},hero:{backgroundColor:'#151515',borderRadius:18,padding:22,marginBottom:24,borderWidth:1,borderColor:'#292929'},eyebrow:{color:'#e21d2f',fontSize:11,fontWeight:'900',letterSpacing:1.5,marginBottom:9},heroTitle:{color:'#fff',fontSize:29,fontWeight:'900',lineHeight:34,marginBottom:10},muted:{color:'#a6a6a6',fontSize:13,lineHeight:20,marginTop:5},primary:{backgroundColor:'#e21d2f',borderRadius:12,padding:16,alignItems:'center',marginTop:18},primaryText:{color:'#fff',fontWeight:'900',letterSpacing:1},secondary:{borderColor:'#444',borderWidth:1,borderRadius:12,padding:15,alignItems:'center',marginTop:14},secondaryText:{color:'#fff',fontWeight:'800',letterSpacing:1,fontSize:12},section:{color:'#fff',fontSize:19,fontWeight:'800',marginBottom:12,marginTop:6},card:{backgroundColor:'#151515',padding:18,borderRadius:14,marginBottom:24},cardTitle:{color:'#fff',fontSize:17,fontWeight:'800',marginBottom:4},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},tile:{width:'48%',backgroundColor:'#151515',padding:17,borderRadius:14,minHeight:68,justifyContent:'center',borderWidth:1,borderColor:'#252525'},tileText:{color:'#fff',fontWeight:'700'},listItem:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#151515',padding:17,borderRadius:13,marginBottom:10,borderWidth:1,borderColor:'#242424'},listText:{color:'#fff',fontSize:15,fontWeight:'700'},sub:{color:'#888',marginTop:4,fontSize:12},arrow:{color:'#e21d2f',fontSize:25,marginLeft:10},kicker:{color:'#e21d2f',fontSize:13,fontWeight:'900',letterSpacing:1.2,marginTop:10},question:{color:'#fff',fontSize:27,lineHeight:33,fontWeight:'900',marginTop:8,marginBottom:12},progress:{color:'#777',fontSize:12,fontWeight:'800',marginBottom:24},answer:{backgroundColor:'#151515',borderWidth:1,borderColor:'#333',borderRadius:14,padding:20,marginBottom:12,alignItems:'center'},answerText:{color:'#fff',fontWeight:'900',letterSpacing:1},result:{backgroundColor:'#151515',borderRadius:16,padding:18,marginVertical:14,borderWidth:1,borderColor:'#292929'},resultTitle:{color:'#fff',fontSize:19,fontWeight:'900',marginBottom:8},resultBullet:{color:'#ddd',marginTop:10,lineHeight:21},resultRow:{borderTopWidth:1,borderTopColor:'#292929',paddingTop:12,marginTop:10},label:{color:'#e21d2f',fontSize:12,fontWeight:'900',letterSpacing:1,marginTop:18},input:{backgroundColor:'#151515',borderWidth:1,borderColor:'#333',borderRadius:12,padding:14,color:'#fff',marginBottom:12},back:{paddingVertical:18,alignItems:'center'},nav:{flexDirection:'row',borderTopWidth:1,borderTopColor:'#282828',backgroundColor:'#101010',paddingTop:10,paddingBottom:8},navItem:{flex:1,alignItems:'center',paddingVertical:7},navText:{color:'#777',fontSize:10,fontWeight:'900',letterSpacing:.3},navActive:{color:'#e21d2f'}
});
