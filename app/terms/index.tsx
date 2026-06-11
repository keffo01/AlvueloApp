import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const TermsAndConditionsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={true}>
        
        <Text style={styles.mainTitle}>Términos y Condiciones generales</Text>
        <Text style={styles.dateText}>Última actualización: 21/10/2024</Text>

        <Text style={styles.sectionTitle}>GENERAL</Text>
        <Text style={styles.paragraph}>
          SERVICIO DE ENTREGAS AL VUELO, con domicilio en Aguilares, distrito de San Salvador Norte, (en adelante “Al Vuelo”) prestan servicios a los usuarios, según los siguientes términos y condiciones (en adelante los “Términos y Condiciones”). Los Términos y Condiciones constituyen el contrato entre el Usuario y Al Vuelo que rige el uso o aprovechamiento por el Usuario de los servicios de Al Vuelo. Estos Términos y Condiciones establecen y regulan los derechos y obligaciones del Usuario respecto del uso de los servicios de Al Vuelo, que pueden afectar sus intereses, por lo que el Usuario debe leerlos con detenimiento.
        </Text>
        <Text style={styles.paragraph}>
          Al utilizar cualquier Servicio actual o futuro de Al Vuelo se estará sujeto a los lineamientos y condiciones aplicables a tal Servicio o negocio.
        </Text>
        <Text style={styles.paragraph}>
          Cualquier Usuario que desee acceder y/o usar el Portal o los Servicios podrá hacerlo sujetándose a estos Términos y Condiciones, junto con todas las demás políticas y principios que rigen en Al Vuelo, incluyendo las Políticas de Privacidad de Al Vuelo y que son incorporados al presente por referencia o están disponibles en www.alvuelo.io. El desconocimiento del contenido de los Términos y Condiciones no justifica el incumplimiento de los mismos, y mucho menos, faculta a los Usuarios para tomar medidas particulares o legales que desconozcan lo planteado en estos Términos y Condiciones.
        </Text>
        <Text style={styles.paragraph}>
          Con su registro y utilización del Portal, los Usuarios están manifestando su aceptación, expresa e inequívoca de los Términos y Condiciones. Respecto de menores de 18 años que quieran hacer uso del Portal, Al Vuelo se permite informar que deben contar con autorización de sus padres o representantes legales previa realización del registro. Al Vuelo se reserva el derecho a negarse a prestar el servicio, cerrar cuentas o eliminar o editar contenido a su entera discreción.
        </Text>
        <Text style={[styles.paragraph, styles.uppercaseBold]}>
          CUALQUIER PERSONA QUE NO ACEPTE ESTOS TÉRMINOS Y CONDICIONES GENERALES Y/O CUALQUIERA DE LAS DEMÁS POLÍTICAS, TÉRMINOS Y CONDICIONES PARTICULARES Y PRINCIPIOS QUE RIGEN EN AL VUELO, INCLUYENDO LA POLÍTICA DE PRIVACIDAD DE AL VUELO, DEBERÁN ABSTENERSE DE UTILIZAR EL PORTAL Y/O LOS SERVICIOS.
        </Text>
        <Text style={styles.paragraph}>
          Si los Usuarios tienen dudas respecto a estos Términos y Condiciones pueden comunicarse con nuestro equipo de Atención al Cliente a través del correo electrónico app.alvuelo.sv@gmail.com.
        </Text>

        <Text style={styles.sectionTitle}>PRIVACIDAD</Text>
        <Text style={styles.paragraph}>
          Por favor, revisar nuestra Política de Privacidad disponible en www.alvuelo.io, que también rige la relación con Al Vuelo, a fin de entender nuestras prácticas, la información que obtenemos de los Usuarios y el uso que damos a esa información.
        </Text>

        <Text style={styles.sectionTitle}>DEFINICIONES</Text>
        <View style={styles.bulletList}>
          <Text style={styles.paragraph}><Text style={styles.boldText}>"Aplicación":</Text> hace referencia a la aplicación “Al Vuelo” disponible para las tecnologías móviles.</Text>
          <Text style={styles.paragraph}><Text style={styles.boldText}>"Bienes":</Text> son los bienes, productos o servicios que pueden llegar a ser ofrecidos por los Oferentes a través del Portal e integran el Pedido del Usuario. Los Bienes son suministrados por los Oferentes, siendo responsables de los mismos ante los Usuarios.</Text>
          <Text style={styles.paragraph}><Text style={styles.boldText}>"Oferente":</Text> se refiere a agentes externos y/o terceros ajenos a Al Vuelo, que previamente han contratado con Al Vuelo sus servicios de intermediación...</Text>
          <Text style={styles.paragraph}><Text style={styles.boldText}>"Pedido":</Text> hace referencia a la solicitud del Usuario a través del Portal de los Bienes de Oferentes.</Text>
          <Text style={styles.paragraph}><Text style={styles.boldText}>"Nosotros", "Nuestro", y "Al Vuelo":</Text> siempre que se haga referencia a los vocablos, se está haciendo referencia directa a la sociedad SERVICIO DE ENTREGAS AL VUELO, con domicilio en la ciudad de Aguilares, departamento de San Salvador.</Text>
          <Text style={styles.paragraph}><Text style={styles.boldText}>"Servicio":</Text> hace referencia al servicio de intermediación solicitado por el Usuario a través del Portal.</Text>
          <Text style={styles.paragraph}><Text style={styles.boldText}>"Sitio Web":</Text> hace referencia al sitio web www.alvuelo.io.</Text>
          <Text style={styles.paragraph}><Text style={styles.boldText}>"Usuario" y "Cliente":</Text> hace referencia a todas las personas físicas o jurídicas que accedan a nuestro Portal y realizan Pedidos sea a través del Sitio Web o de la Aplicación.</Text>
          <Text style={styles.paragraph}><Text style={styles.boldText}>“Portal”:</Text> hace referencia a nuestro Sitio Web y/o Aplicación a través de las cuales, en calidad de intermediarios, facilitamos el contacto entre Oferentes, Usuarios y repartidores.</Text>
        </View>
        <Text style={styles.paragraph}>
          En caso de utilizarse alguna de las palabras definidas con anterioridad en plural, éstas tendrán el mismo significado que el indicado en el presente.
        </Text>

        <Text style={styles.sectionTitle}>CAPACIDAD</Text>
        <Text style={styles.paragraph}>
          Los Servicios y Productos solo están disponibles para Usuarios que tengan capacidad legal para contratar. No podrán utilizar los Servicios las personas que no tengan esa capacidad, los menores de edad sin autorización de su padre o tutor o representantes o Usuarios de Al Vuelo que hayan sido suspendidos temporalmente o inhabilitados definitivamente.
        </Text>
        <Text style={styles.paragraph}>
          Para registrar una empresa como Usuario, se deberá contar con la capacidad suficiente como para contratar a nombre y representación de la entidad como así también de obligar a la misma según estos Términos y Condiciones aquí previstos.
        </Text>
        <Text style={styles.paragraph}>
          En caso de desear adquirir bebidas alcohólicas, tabaco o cualquier otro producto prohibido a menores de edad, en pleno cumplimiento de las normas aplicable, el Usuario deberá acreditar ser mayor de 18 años, exhibiendo una identificación al momento de la entrega. Asimismo, en el caso de venta de bebidas alcohólicas pueden existir restricciones horarias en función de la normativa del lugar de residencia del Usuario.
        </Text>

        <Text style={styles.sectionTitle}>DERECHOS DE AUTOR</Text>
        <Text style={styles.paragraph}>
          El contenido del Portal, incluyendo, pero sin limitarse a los textos, gráficas, imágenes, logotipos, íconos, software y cualquier otro material, -al cual en adelante se hará referencia como el “Material”, está protegido bajo las leyes aplicables de propiedad industrial y propiedad intelectual. Todo el Material es de propiedad de Al Vuelo o de sus proveedores. Queda prohibido modificar, copiar, reutilizar, extraer, explotar, reproducir, comunicar al público, hacer segundas o posteriores publicaciones, cargar o descargar archivos, enviar por correo, transmitir, usar, tratar o distribuir de cualquier forma la totalidad o parte de los contenidos incluidos en el Portal. El uso no autorizado del Material puede constituir una violación de las leyes sobre derechos de autor, leyes de propiedad industrial u otras leyes. Ningún Usuario podrá vender o modificar el Material de manera alguna, ni ejecutar o anunciar públicamente el Material, ni distribuirlo para propósitos comerciales. Tampoco se permitirá copiar o adaptar el código HTML que Al Vuelo crea para generar su página web o plataforma, ya que el mismo está protegido por los derechos de autor. Todo uso no autorizado se presumirá como indebido y podrá ser sancionado por la ley.
        </Text>

        <Text style={styles.sectionTitle}>MARCAS COMERCIALES</Text>
        <Text style={styles.paragraph}>
          Al Vuelo, el logotipo de Al Vuelo, y otras marcas indicadas en el Portal son marcas comerciales de Al Vuelo. Otros gráficos, logotipos, encabezados de página, íconos de botones, guiones y nombres de servicio de Al Vuelo son marcas comerciales o imágenes comerciales de Al Vuelo. Las marcas comerciales e imagen comercial Al Vuelo no podrán ser utilizadas en relación con cualquier producto o servicio que no sea de Al Vuelo, en su caso, de ninguna manera que pueda causar confusión entre los Usuarios o que desestime o desacredite a Al Vuelo.
        </Text>

        <Text style={styles.sectionTitle}>USO AUTORIZADO DEL PORTAL</Text>
        <Text style={styles.paragraph}>
          El Portal tiene como fin principal la intermediación entre Usuarios y Oferentes para realizar Pedidos en las ciudades de El Salvador que posean el servicio, facilitando las relaciones y transacciones entre Usuarios y Oferentes adheridos al Portal. Asimismo, mediante el Portal los Usuarios podrán contratar Servicios, realizando Pedidos, según los términos y condiciones aplicables, publicados en el Portal.
        </Text>
        <Text style={styles.paragraph}>
          Al Vuelo contacta al Oferente, redirecciona el pedido, se encarga de informar respecto de su disponibilidad o no al Usuario de conformidad con la información que le haya proporcionado el Oferente. A través del Portal se centralizan y otorgan a los Usuarios, todas las herramientas necesarias para que éste realice un Pedido.
        </Text>
        <Text style={styles.paragraph}>
          Al Vuelo siempre hará su mejor esfuerzo para que una vez que el pedido haya sido confirmado por parte del Oferente al cual ha sido solicitado, el Oferente entregue el pedido de acuerdo a las especificaciones contratadas.
        </Text>

        <Text style={styles.sectionTitle}>CREACIÓN DE CUENTA</Text>
        <Text style={styles.paragraph}>
          Para el uso del Portal, los Usuarios deberán crear una cuenta de usuario (la “Cuenta”) donde se le solicitarán ciertos datos tales como: nombre, fecha de nacimiento, dirección, teléfono, correo electrónico, documento de identidad, identificación fiscal, y datos para procesar los pagos online (los “Datos”), los cuales estarán sujetos a las Políticas de Privacidad de Al Vuelo.
        </Text>
        <Text style={styles.paragraph}>
          Los Usuarios garantizan y responderán por la veracidad, exactitud, vigencia, autenticidad y actualización de sus Datos. Al Vuelo en ningún caso será responsable por la falsedad o inexactitud de los Datos proporcionados por los Usuarios.
        </Text>
        <Text style={styles.paragraph}>
          En caso de que la registración sea a través de Facebook, Google o Apple, los Usuarios podrán crear su Cuenta con la utilización de las credenciales allí incluidas, sin perjuicio de lo dispuesto anteriormente en relación a los Datos, que serán tomados por Al Vuelo para la creación de la Cuenta.
        </Text>
        <Text style={styles.paragraph}>
          Al Vuelo podrá requerir alguna información o documentación adicional a los efectos de comprobar o corroborar los Datos, pudiendo negar el acceso al Portal o suspender temporal o definitivamente a aquellos Usuarios cuyos Datos no hayan podido ser confirmados.
        </Text>
        <Text style={styles.paragraph}>
          Para acceder a su Cuenta personal el Usuario deberá ingresar su correo electrónico y una contraseña la cual deberá mantener siempre de manera confidencial. Si el Usuario olvida su contraseña, podrá restablecerla haciendo clic en “Olvidé mi contraseña”.
        </Text>
        <Text style={styles.paragraph}>
          La Cuenta es única e intransferible. Queda prohibido que un Usuario registre o tenga más de una Cuenta. De detectarse el incumplimiento a lo antes previsto Al Vuelo se reserva el derecho de cancelar, suspender o inhabilitar las cuentas, sin perjuicio de otras medidas legales que pueda tomar.
        </Text>
        <Text style={styles.paragraph}>
          Al Vuelo no puede garantizar la identidad de los Usuarios. El Usuario es responsable de todas las transacciones realizadas en su Cuenta, debiendo notificar a Al Vuelo inmediatamente, de forma fehaciente, cualquier uso no autorizado de la misma, así como cualquier sustracción, divulgación o pérdida de sus datos de acceso al Portal. Al Vuelo vela por la protección de los datos de los Usuarios. Sin embargo, no será responsable del uso fraudulento que puedan hacer terceros de la Cuenta del Usuario, incluidos usos indebidos de sus datos asociados a los pagos online.
        </Text>
        <Text style={styles.paragraph}>
          Al Vuelo se reserva el derecho de rechazar cualquier solicitud de registro o de cancelar una registración previamente aceptada, sin que esté obligada a comunicar o exponer las razones de su decisión y sin que ello genere algún derecho a indemnización o resarcimiento.
        </Text>
        <Text style={styles.paragraph}>
          Los Usuarios tienen la facultad de ejercer el derecho de acceso, en cualquier momento y sin restricciones, de sus datos personales. Al Vuelo tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.
        </Text>

        <Text style={styles.sectionTitle}>PROCEDIMIENTO DE PEDIDOS Y ACLARACIONES GENERALES</Text>
        <Text style={styles.paragraph}>
          Al Vuelo ofrece una plataforma de intermediación en línea (el Portal) para que los Oferentes puedan ofrecer sus Bienes, y los Usuarios puedan adquirirlos y solicitar su entrega a domicilio. En ese marco, Al Vuelo exhibe la información de los Bienes del Oferente según la información provista por este último, no responsabilizándose por la exactitud y/o veracidad de la misma, ni por el precio ofrecido por el Oferente.
        </Text>
        <Text style={styles.paragraph}>
          El Usuario comprende y acepta que Al Vuelo no produce, provee, vende, expende ni es agente, representante, mandatario, distribuidor, ni en general ningún tipo de comercializador de los Bienes exhibidos; por lo anterior, la relación de compraventa es estructurada entre el Usuario y el Oferente. Asimismo, el Usuario reconoce que es el único responsable por la correcta consignación de las direcciones de entrega y recogida de los Pedidos, eximiendo de responsabilidad a Al Vuelo y a los repartidores por cualquier error o negligencia.
        </Text>
        <Text style={styles.paragraph}>
          El Usuario podrá ver las diferentes opciones disponibles sin estar registrado. Sin embargo, para poder finalizar el Pedido, el Usuario debe estar registrado con su Cuenta y debe ingresar el domicilio de entrega. Una vez realizado lo anterior, el Usuario podrá ver las diferentes opciones de Oferentes, Bienes, ubicación de los Oferentes, etc.
        </Text>
        <Text style={styles.paragraph}>
          Cuando el Usuario ha definido a dónde y qué quiere pedir, debe ingresar al perfil del Oferente en el Portal y elegir el/los Bienes que desea adquirir. Una vez seleccionados, se pone a disposición del Usuario las características, condiciones y valor total del Pedido según la información provista por el Oferente, las comisiones y los impuestos aplicables. El Usuario deberá validar el Pedido y seleccionar el método de pago elegido a través de los medios de pago disponibles en Al Vuelo para cada Oferente, según se indica en la sección 12 de estos Términos y Condiciones. Seleccionada la forma de pago, el Usuario deberá confirmar el Pedido.
        </Text>
        <Text style={styles.paragraph}>
          Es importante aclarar que todo Usuario se compromete a pagar el precio del Pedido desde el momento en el que recibe la comunicación de confirmación del Pedido según se indica más abajo en estos Términos y Condiciones. Tras la recepción de dicha comunicación, el Usuario únicamente podrá abstenerse de realizar el pago si el Pedido es cancelado de forma correcta, según lo previsto en estos Términos y Condiciones.
        </Text>
        <Text style={styles.paragraph}>
          Si el Usuario no recibe el Pedido en el domicilio indicado para ello y/o si surge algún contratiempo en donde no se verifiquen los datos del Usuario y se rechace el pedido una vez fue confirmado por el Portal y en ese sentido no se reciban correcciones una vez efectuada la confirmación, toda la responsabilidad recaerá sobre el Usuario y éste deberá indemnizar al Portal haciéndose cargo de todos los costos que generó el error en la transacción, a modo de ejemplo, el costo de envío que pudiera aplicar.
        </Text>
        <Text style={styles.paragraph}>
          Todos los Pedidos que se realizan a través del Portal son transmitidos a los Oferentes, quienes podrán contactarse con el Usuario, a modo de ejemplo, si los productos o servicios que integran el Pedido no se encuentran disponibles.
        </Text>
        <Text style={styles.paragraph}>
          Cuando el Oferente acepta o rechaza el Pedido, se comunica al Usuario con un correo electrónico, una notificación PUSH (emergente) u otro medio de comunicación, en donde se rechaza o confirma la recepción del Pedido, el cual se produce de forma automática con los detalles.
        </Text>
        <Text style={styles.paragraph}>
          En caso de rechazarse el Pedido por parte del Oferente, Al Vuelo notificará al Usuario sin la obligación de notificar los motivos del rechazo.
        </Text>
        <Text style={styles.paragraph}>
          En caso de confirmarse el pedido, la PUSH (emergente) u otro medio de comunicación, indicará el tiempo de entrega del Pedido. Dicho tiempo de entrega es exclusivamente estimado, y el Usuario reconoce que el mismo podrá sufrir pequeños ajustes mientras el Pedido se prepara (dichos ajustes se verán reflejados en el estado del pedido que se visualiza en el Portal). El Usuario, al hacer su Pedido, afirma conocer y aceptar que innumerables factores como el tráfico, el clima, los horarios pico y la capacidad de preparación del pedido y entrega de algunos Oferentes, pueden ser limitantes para asegurar la hora de entrega.
        </Text>
        <Text style={styles.paragraph}>
          Durante el tiempo que transcurra entre la confirmación del Pedido y la efectiva entrega del mismo, el Usuario podrá comunicarse en cualquier momento con Al Vuelo a efectos de hacer preguntas, presentar quejas, entre otros, casos en los cuales siempre recibirá una respuesta en el menor tiempo posible.
        </Text>
        <Text style={styles.paragraph}>
          El Usuario podrá cancelar el Pedido una vez transcurrido el plazo de entrega indicado en la confirmación del pedido.
        </Text>
        <Text style={styles.paragraph}>
          Al Vuelo siempre actuará como intermediaria y centrará sus esfuerzos en resolver todas las quejas o situaciones problemáticas que se configuren con ocasión a demoras, pedidos incompletos o equivocados, etc. En todos los casos, sin excepción, las quejas deben ser presentadas en un lenguaje decente y respetuoso, atendiendo a los presupuestos mínimos de cortesía y educación. En caso contrario, Al Vuelo no estará obligado a proporcionar respuesta alguna y, por el contrario, de acuerdo con su propio criterio, podrá proceder a bloquear al Usuario de su base de datos, quedando dicho Usuario imposibilitado para utilizar los Servicios nuevamente.
        </Text>
        <Text style={styles.paragraph}>
          El Usuario podrá interponer cualquier queja o reclamo a través de la “Ayuda en Línea”. Todos los comentarios y calificaciones son revisados por el personal de Al Vuelo y son debidamente registrados en el historial de cada Usuario.
        </Text>
        <Text style={styles.paragraph}>
          La entrega del Pedido podrá realizarse con repartidores del Oferente u otros puestos a disposición por Al Vuelo y sus contratistas, según se indica en el Portal. El Usuario comprende y acepta que Al Vuelo no se hará responsable ante el Usuario por la falta de entrega del Pedido o en caso que se viera alterado o perjudicado - en caso que el Oferente se encargue de este servicio.
        </Text>

        <Text style={styles.sectionTitle}>PRECIO DE LOS BIENES</Text>
        <Text style={styles.paragraph}>
          El precio de los Bienes será presentado en el Portal, según la información provista por el Oferente, antes de que la transacción sea aceptada por el Usuario. Dicho precio incluirá todos los posibles recargos por impuestos, adiciones, etc., que sean aplicables a cada transacción. Se aclara que algunos Oferentes pueden tener importe mínimo de pedido y que también pueden aplicar costos de envío, lo que se indicará en los perfiles de los Oferentes. El Oferente es el responsable de la emisión y entrega al Usuario de la factura o comprobante fiscal respectivo por los Bienes solicitados, según sea requerido por la legislación aplicable.
        </Text>
        <Text style={styles.paragraph}>
          El Usuario comprende y acepta que, en caso de solicitar modificaciones a los Bienes integrantes del Pedido, el precio podrá tener modificaciones.
        </Text>
        <Text style={styles.paragraph}>
          Es responsabilidad del Usuario asegurarse en el momento de la entrega del Pedido que éste corresponde con los Bienes solicitados, que todo lo recibido sea correcto y que la factura o comprobante fiscal refleje correctamente los detalles del Pedido. En caso contrario, el Usuario puede rechazar el Pedido devolviéndoselo al repartidor.
        </Text>

        <Text style={styles.sectionTitle}>CARGOS</Text>
        <Text style={styles.paragraph}>
          El Usuario acepta que Al Vuelo puede aplicar ciertos cargos por el uso del Servicio (los “Cargos”). Al Vuelo se reserva el derecho de modificar o eliminar los Cargos en cualquier momento durante la vigencia de estos Términos y Condiciones. En caso de aplicar, el Usuario verá reflejado el monto de los Cargos en forma previa a la confirmación del Pedido.
        </Text>

        <Text style={styles.sectionTitle}>MEDIOS DE PAGO</Text>
        <Text style={styles.paragraph}>
          Los métodos de pago para cada Pedido dependen de cada Oferente, por lo que el Usuario podrá verificar esta información en sus respectivos perfiles.
        </Text>
        
        <Text style={styles.subTitle}>Pago en efectivo al momento de la entrega</Text>
        <Text style={styles.paragraph}>
          El Usuario podrá abonar el Pedido al repartidor en efectivo en la misma moneda en la que el precio del Bien se encuentre presentado en el Portal, con exclusión de cualquier otra moneda. Asimismo, el Usuario podrá indicar el monto exacto con el que abonará el Pedido, de manera que pueda establecerse si existe algún cargo en diferencia que deba retornarse al Usuario.
        </Text>

        <Text style={styles.subTitle}>Pago Online</Text>
        <Text style={styles.paragraph}>
          El Usuario podrá abonar el precio del Pedido mediante tarjeta de crédito, débito, Mis Cupones, etc.
        </Text>
        <Text style={styles.paragraph}>
          Cuando el Usuario elija realizar el pago online: (i) para abonar el monto del Pedido el Usuario deberá cargar una tarjeta de crédito o débito que permita al Usuario realizar consumos o efectuar el pago del Pedido, incluyendo las comisiones, recargos y los impuestos aplicables, en la misma moneda en que los Bienes son presentados por los Oferentes en el Portal. Al Vuelo podrá rechazar cualquier medio de pago y por lo tanto cualquier Pedido que no cumpla con las características antes descritas. Esta información es gestionada de forma segura; sus datos no son almacenados en Al Vuelo; o (ii) deberá seleccionar un medio de pago electrónico cargado previamente en el Portal, siempre que dicho medio de pago cumpla con las características aquí señaladas y permita al Usuario realizar consumos o efectuar el pago del Pedido, incluyendo las comisiones, recargos y los impuestos aplicables, en la misma moneda en que los Bienes son presentados por los Oferentes en el Portal.
        </Text>
        <Text style={styles.paragraph}>
          El Usuario deberá tener particular cuidado en el suministro de datos personales, los cuales deben ser completos y verídicos en el momento de realización del Pedido. Asimismo, al ingresar los datos el Usuario garantiza que (i) los datos que suministra de su medio de pago electrónico son de su propiedad y tiene suficientes fondos para hacer el pago en la misma moneda en que los Bienes son presentados en el Portal, cuando éste sea el método de preferencia; (ii) su identidad corresponde con la información contenida en la identificación oficial y original otorgada por las autoridades nacionales.
        </Text>

        <Text style={styles.subTitle}>Verificación de la identidad por medio de herramientas propias del dispositivo</Text>
        <Text style={styles.paragraph}>
          En algunos casos, dependiendo del dispositivo que el Usuario utilice y siempre que Al Vuelo haya realizado las integraciones pertinentes, Al Vuelo podrá utilizar herramientas propias del dispositivo (i.e. Keychain, entre otras) que le permitan verificar la identidad del usuario y su vinculación con los medios de pago a través de los datos biométricos almacenados en el mismo.
        </Text>
        <Text style={styles.paragraph}>
          Bajo ningún punto de vista Al Vuelo almacenará ni tratará los datos personales del Usuario cuando utilice este tipo de funcionalidades. Dichos datos, sus funcionalidades y su almacenamiento serán de responsabilidad exclusiva del usuario y serán regulados expresamente por los términos y condiciones de las herramientas de verificación propias del dispositivo que hayan sido previamente aceptados por el usuario.
        </Text>
        <Text style={styles.paragraph}>
          El monto se descuenta al realizar el Pedido. Si posteriormente el Pedido es cancelado -ya sea por Al Vuelo , por el Usuario o por el Oferente-, Al Vuelo procesará la devolución al instante y en la misma moneda. Sin embargo, el reintegro depende de los tiempos estipulados en las políticas del emisor de cada medio de pago electrónico (por ej. de la tarjeta), sobre los cuales Al Vuelo no tiene ninguna responsabilidad ni capacidad de modificar los tiempos que éstas devoluciones le insuman, resultando suficiente medio de prueba del actuar diligente de Al Vuelo y por lo tanto, exonerándolo de responsabilidad, la acreditación a través de documentación de procesamiento de pagos, de la solicitud de devolución de las sumas por Al Vuelo a las empresas de procesamiento de pagos y empresas emisoras de tarjetas, según corresponda.
        </Text>
        <Text style={styles.paragraph}>
          Si las devoluciones mencionadas no pueden ejecutarse por factores asociados a las emisoras de los medios de pago electrónicos, el importe será acreditado mediante un Cupón en la cuenta del Usuario y se le notificará sobre dicho crédito.
        </Text>
        <Text style={styles.paragraph}>
          Las transacciones online podrán ser rechazadas cuando la validación y aceptación del pago no sea confirmada o aceptada por Al Vuelo o cuando la entidad bancaria del Usuario o el medio de pago así lo determinen. Al Vuelo, no se hace responsable por los trámites internos de autorización que disponga la entidad bancaria/financiera que emita los instrumentos de pago, ni por lo permisos que requieren los medios de pago para efectuar compras por internet.
        </Text>
        <Text style={styles.paragraph}>
          En el detalle de la transacción el Usuario podrá verificar la información completa de pago. Si el Usuario abonó el pedido con Pago Online y el pago fue confirmado, no deberá realizar otro pago por el Pedido, salvo que hubiera realizado modificaciones al Pedido según se indica en estos Términos y Condiciones.
        </Text>
        <Text style={styles.sectionTitle}>PUBLICIDAD</Text>
        <Text style={styles.paragraph}>
          Al Vuelo cuenta con un servicio de publicidad por medio del cual ésta se hace llegar a los Usuarios a través de banderas (banners), correos electrónicos y/u otros medios. Los enlaces o vínculos que dirigen a otros sitios web de propiedad de terceras personas se suministran para su conveniencia únicamente y Al Vuelo no respalda, recomienda o asume responsabilidad alguna sobre el contenido de estos.
        </Text>
        <Text style={styles.paragraph}>
          El Usuario puede solicitar no recibir más correos electrónicos u otras notificaciones relativas a publicidad mediante la configuración del perfil de su cuenta.
        </Text>

        <Text style={styles.sectionTitle}>PROMOCIONES, CONCURSOS Y EVENTOS</Text>
        <Text style={styles.paragraph}>
          Las promociones, concursos, descuentos, sorteos y eventos que se implementen a través del Portal estarán sujetas a las reglas y condiciones que en cada oportunidad se establezcan, de manera anticipada por Al Vuelo. Bajo ningún motivo esto implica que Al Vuelo está obligada a realizar algún tipo de sorteo, simplemente regula una situación con anterioridad, en caso de que Al Vuelo de manera voluntaria, decida llevar a cabo tales actividades. En caso de que se realice alguna de las mencionadas actividades será requisito mínimo para acceder a tales oportunidades o beneficios comerciales, que el Usuario se encuentre debidamente registrado en el Portal y cumpla con las condiciones de mayoría de edad o cuente con la autorización de su padre o tutor. Los términos y condiciones de promociones, incentivos y/o actividades especiales con una vigencia limitada se publicarán en debida forma en el Portal y se entienden como parte de estos Términos y Condiciones.
        </Text>
        <Text style={styles.paragraph}>
          El Usuario acepta que Al Vuelo podrá realizar acuerdos comerciales con terceros a los efectos de realizar comunicaciones promocionales, incluyendo el envío de muestras gratuitas a domicilio junto al Pedido.
        </Text>

        <Text style={styles.sectionTitle}>RESPONSABILIDAD</Text>
        <Text style={styles.paragraph}>
          Al Vuelo únicamente pone a disposición de los Usuarios un espacio virtual de intermediación que les permite ponerse en comunicación mediante internet a los Usuarios, los Oferentes y los repartidores y así comprar y vender, respectivamente, los Bienes. Al Vuelo no es proveedora ni propietaria de los Bienes, no tiene posesión de ellos, no los almacena ni los ofrece en venta. El Oferente es el único responsable de la existencia, calidad, cantidad, estado, integridad, inocuidad, el precio de venta o legitimidad de los Bienes. El Usuario conoce y acepta que al realizar Pedidos a los Oferentes lo hace bajo su propio riesgo.
        </Text>
        <Text style={styles.paragraph}>
          En el caso en que los Bienes ofrezcan garantías (por ej. productos electrónicos exhibidos en el Portal), será el Oferente el obligado a ofrecer estas garantías y en ningún caso, Al Vuelo.
        </Text>
        <Text style={styles.paragraph}>
          Si los Bienes no se ajustan a la calidad, idoneidad o seguridad propias y necesarias, el Usuario podrá solicitar el cambio de estos, o la devolución, según corresponda; y siempre que haya fundamento jurídico y racional para ello, para lo cual Al Vuelo trasladará tal solicitud al Oferente, que decidirá la procedencia o no de ésta en su calidad de productor y único responsable respecto de las características objetivas ofertadas. La garantía solo aplica para características objetivas de los productos.
        </Text>

        <Text style={styles.sectionTitle}>REGLAS GENERALES</Text>
        <Text style={styles.paragraph}>
          Los Usuarios no pueden usar el Portal con el fin de transmitir, distribuir, almacenar o destruir material (i) en violación de cualquier ley aplicable o regulación, (ii) de manera que se infrinjan las leyes sobre derechos de autor, propiedad industrial, secretos comerciales o cualquier otro derecho de propiedad intelectual de terceros o de manera que viole la privacidad, publicidad u otros derechos personales de terceros, o (iii) en forma que sea difamatoria, obscena, amenazante o abusiva. Esto sin perjuicio de normas particulares sobre la materia que sean imperativas en cada uno de los ordenamientos jurídicos correspondientes a los territorios en los cuales Al Vuelo prestará su servicio.
        </Text>

        <Text style={styles.sectionTitle}>REGLAS DE SEGURIDAD</Text>
        <Text style={styles.paragraph}>
          A los Usuarios les está prohibido violar o intentar violar la seguridad del Portal. Específicamente los Usuarios, a modo de ejemplo y sin que implique limitación, no podrán (i) acceder a información que no esté dirigida o autorizada a dicho Usuario o acceder a servidores o cuentas a los cuales el Usuario no está autorizado a acceder; (ii) intentar probar la vulnerabilidad de un sistema o red sin la debida autorización o violar las medidas de seguridad o autenticación; (iii) intentar interferir con los servicios prestados a un Usuario, servidor o red, incluyendo pero sin limitarse al envío de virus a través del Portal o sobre carga de tráfico para denegación del servicio; (iv) enviar correo electrónico no solicitado, incluyendo promociones y/o publicidad de productos o servicios. La violación de cualquier sistema o red de seguridad puede resultar en responsabilidades civiles y penales. PedidosYa investigará la ocurrencia de hechos que puedan constituir violaciones a lo anterior y cooperará con cualquier autoridad competente en la persecución de los Usuarios que estén envueltos en tales violaciones; (v) suplantar la identidad de otros usuarios o de personas naturales o jurídicas de cualquier índole; (vi) proporcionar información de identidad incorrecta, incompleta o falsa; y (vii) bajo ninguna circunstancia se tolerará la acción de hacer pedidos falsos o crear usuarios con fines fraudulentos, actuar que será denunciado y estará sujeto a las prosecuciones legales aplicables.
        </Text>
        <Text style={styles.paragraph}>
          El Portal puede ser usado únicamente para propósitos legales. Se prohíbe su uso en cualquiera de las siguientes formas:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.paragraph}>• Incluir en el Portal cualquier derecho de franquicia, esquema de pirámide, membresía a un club o grupo, representación de ventas, agencia comercial o cualquier oportunidad de negocios que requiera un pago anticipado o pagos periódicos, solicitando el reclutamiento de otros miembros, sub-distribuidores o sub-agentes.</Text>
          <Text style={styles.paragraph}>• Borrar o revisar cualquier material incluido en el Portal por cualquier otra persona o entidad, sin la debida autorización.</Text>
          <Text style={styles.paragraph}>• Usar cualquier elemento, diseño, software o rutina para interferir o intentar interferir con el funcionamiento adecuado del Portal o cualquier actividad que sea llevada a cabo en el Portal.</Text>
          <Text style={styles.paragraph}>• Intentar descifrar, compilar o desensamblar cualquier software comprendido en el Portal o que de cualquier manera haga parte de este.</Text>
          <Text style={styles.paragraph}>• Como ya se mencionó, está terminantemente prohibido incluir en el Portal información falsa, inexacta, incompleta, incorrecta o engañosa.</Text>
        </View>

        <Text style={styles.sectionTitle}>PROHIBICIÓN DE REVENTA, CESIÓN O USO COMERCIAL NO AUTORIZADO</Text>
        <Text style={styles.paragraph}>
          Los Usuarios acuerdan no revender o ceder sus derechos u obligaciones al aceptar estos Términos y Condiciones. También se comprometen a no hacer un uso comercial no autorizado del Portal.
        </Text>

        <Text style={styles.sectionTitle}>TERMINACIÓN</Text>
        <Text style={styles.paragraph}>
          Al Vuelo se reserva el derecho, a su exclusiva discreción, de suspender o cancelar la registración del Usuario, y por lo tanto, negarle acceso a este Portal, ante el incumplimiento de estos Términos y Condiciones por parte de los Usuarios o ante la imposibilidad de verificar o autenticar cualquier información que estos hayan presentado en el registro para acceder al Portal. Sin perjuicio, de conservar determinada información para efectos únicamente estadísticos y sin que ello implique bajo ningún entendido la preservación de datos personales, ya que se garantiza que tal información se conservará en términos de absoluto anonimato.
        </Text>

        <Text style={styles.sectionTitle}>INFORMACIÓN ADICIONAL</Text>
        <Text style={[styles.paragraph, styles.boldText]}>
          AL VUELO NO GARANTIZA QUE EL PORTAL OPERE LIBRE DE ERRORES O QUE SU SERVIDOR SE ENCUENTRE LIBRE DE VIRUS DE COMPUTADORES U OTROS MECANISMOS DAÑINOS. SI EL USO DEL PORTAL O DEL MATERIAL RESULTA EN LA NECESIDAD DE SOLICITAR SERVICIO DE REPARACIÓN O MANTENIMIENTO A SUS EQUIPOS O INFORMACIÓN O DE REEMPLAZAR SUS EQUIPOS O INFORMACIÓN, AL VUELO NO ES RESPONSABLE POR LOS COSTOS QUE ELLO IMPLIQUE.
        </Text>
        <Text style={[styles.paragraph, styles.boldText]}>
          EL PORTAL Y EL MATERIAL SE PONEN A DISPOSICIÓN DE LOS USUARIOS EN EL ESTADO EN QUE SE ENCUENTREN. NO SE OTORGA GARANTÍA ALGUNA SOBRE LA EXACTITUD, CONFIABILIDAD U OPORTUNIDAD DEL MATERIAL, LOS SERVICIOS, LOS TEXTOS, EL SOFTWARE, LAS GRÁFICAS Y LOS ENLACES O VÍNCULOS.
        </Text>
        <Text style={[styles.paragraph, styles.boldText]}>
          EN NINGÚN CASO, AL VUELO, SUS PROVEEDORES O CUALQUIER PERSONA MENCIONADA EN EL PORTAL, SERÁ RESPONSABLE POR DAÑOS DE CUALQUIER NATURALEZA, RESULTANTES DEL USO O LA IMPOSIBILIDAD DE USARLOS.
        </Text>

        <Text style={styles.sectionTitle}>LEY APLICABLE</Text>
        <Text style={styles.paragraph}>
          Al visitar el Portal, el Usuario acepta que las leyes de la República de El Salvador, independientemente de los principios de conflicto de leyes, regirán estos Términos y Condiciones, así como cualquier controversia, de cualquier tipo, que pudiera surgir entre el Usuario y Al Vuelo.
        </Text>

        <Text style={styles.sectionTitle}>POLÍTICAS, MODIFICACIÓN Y DIVISIBILIDAD DEL SITIO WEB</Text>
        <Text style={styles.paragraph}>
          Favor de revisar nuestras otras políticas publicadas en el Sitio Web, incluyendo nuestras Políticas de Privacidad. Estas políticas también regirán su visita a Al Vuelo. Nos reservamos el derecho a hacer cambios a nuestro Portal, políticas y a estos Términos y Condiciones en cualquier momento. En caso de que alguna de estas condiciones resulte inválida, nula o por cualquier razón inaplicable, tal condición se considerará separable y no afectará la validez y aplicabilidad de ninguna de las demás condiciones.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 50,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#222222',
  },
  uppercaseBold: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bulletList: {
    marginLeft: 10,
  }
});

export default TermsAndConditionsScreen;