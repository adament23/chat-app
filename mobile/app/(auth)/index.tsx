import { View, Text, Dimensions, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import useSocialAuth from '@/hooks/useSocialAuth'

const { width, height } = Dimensions.get('window') 

const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth()

  const isLoading = loadingStrategy !== null;

  return (
    <View className='flex-1 bg-surface-dark'>
      <View className='absolute inset-0 overflow-hidden'></View>
      
      <SafeAreaView className='flex-1'>
        {/* Top Section Branding */}
        <View className='items-center pt-10'>
          <Image source={require('../../assets/images/logo.png')}
          style={{width: 100, height: 100, marginVertical: -20}}
          contentFit='contain'/>
          <Text className='text-4xl font-bold text-primary 
          font-serif tracking-wider uppercase'>
            Whisper
          </Text>
        </View>
        {/* Center Section - Hero IMG */}
        <View className='flex-1 justify-center items-center px-6'> 
          <Image source={require('../../assets/images/auth.png')}
          style={{width: width-48, height: height*0.3}}
          contentFit='contain'/>

          {/* Headline */}
          
          <View className='mt-6 items-center'>
            <Text className='text-3xl font-bold text-foreground text-center font-serif'>
              Connect & Chat
            </Text>
            <Text className='text-2xl font-bold text-primary  font-serif'>
              Seamlessly
            </Text>
          </View>
          {/* Auth buttons */}
          <View className='flex-row gap-4 mt-10'>
            {/* Google BTN */}
            <Pressable className='flex-1 flex-row items-center justify-center gap-2
             bg-white/10 py-4 rounded-2xl border border-white/20 active:scale-[0.97]'
             disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              onPress={() => !isLoading && handleSocialAuth("oauth_google")}
             >
              {loadingStrategy==="oauth_google"?(
                <ActivityIndicator size="small" color="#lalala" />
              ):(
              <>
                <Image source={require('../../assets/images/google.png')}
              style={{width:24, height:24}}
              contentFit='contain'/>
              <Text className='text-white font-semibold text-sm'>
                Google
              </Text>
              </>
              )}
             </Pressable>
             {/* Apple BTN */}
             <Pressable className='flex-1 flex-row items-center justify-center gap-2
              bg-white/10 py-4 rounded-2xl border border-white/20 active:scale-[0.97]'
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
             >
              {loadingStrategy === "oauth_apple" ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                  <Text className="text-foreground font-semibold text-sm">Apple</Text>
                </>
              )}
              
             </Pressable>

          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default AuthScreen