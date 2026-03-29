
import { Text, View } from 'react-native'

import {styled} from 'nativewind';
import { SafeAreaView as RnSafeAreaView, } from 'react-native-safe-area-context';
const SafeAreaView = styled(RnSafeAreaView);

const Insights = () =>{
    return (
        <SafeAreaView className="flex-1 bg-background p-5'>
            <Text>Insights</Text>
        </SafeAreaView>
    )
}
export default Insights